import * as express from 'express';
import Cookies from 'universal-cookie';
import { createLoggerSet } from '../../../../api/src/lib/logging/logger';
import { manuallyRefreshTokens, tokenIsExpired } from '../../shared/auth/helpers';
import { decode } from 'jsonwebtoken';
import { AuthTokens, IdentityCookies, IdToken } from 'auth/types';
import setCookieParser, { Cookie } from 'set-cookie-parser';

export const decodeToken = async (token: string): Promise<IdToken | null> => {
    try {
        return decode(token) as IdToken;
    } catch {
        return null;
    }
};

const log = createLoggerSet('KeepTokensFresh');

const getTokensFromRequest = (cookies: Record<string, string>): AuthTokens | null => {
    const idToken = cookies[IdentityCookies.IdToken];
    const accessToken = cookies[IdentityCookies.AccessToken];
    const refreshToken = cookies[IdentityCookies.RefreshToken];

    if (idToken && accessToken && refreshToken) {
        return {
            idToken,
            accessToken,
            refreshToken,
        };
    }

    return null;
};

/**
 * In the process of handling a request we need to make another request to an external
 * service. That request returns some cookies in the form of a set cookie header
 * we need to be able to break down that set cookie header and apply it to the
 * current request we are resolving.
 */
const forwardCookies = (response: express.Response, setCookieHeader: string) => {
    const cookiesSplit = setCookieParser.splitCookiesString(setCookieHeader);
    cookiesSplit.forEach((c) => {
        const [parsed] = setCookieParser.parse(c);
        response.cookie(parsed.name, parsed.value, {
            ...parsed,
            sameSite: parsed.sameSite as express.CookieOptions['sameSite'],
        });
    });
};

export const keepTokensFresh = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
): Promise<void> => {
    let tokens: AuthTokens | null = null;
    let isLoggedIn = false;

    /**
     * Now we are on the server side and we have the express request info
     * the fastest way to get the token is to read it as a cookie
     */
    const cookies = new Cookies(req.headers.cookie);
    const allCookies = cookies.getAll<Record<string, string>>();
    const authTokens = getTokensFromRequest(allCookies);

    if (!authTokens) {
        log.warn('No Auth tokens found in request');
        next();
        return;
    }

    const idToken = authTokens?.idToken;

    if (idToken) {
        log.info('Found a ID token in request cookie');
        const decodedIdToken = await decodeToken(idToken);

        if (!decodedIdToken) {
            log.info('Failed to parse the id token');
            next();
            return;
        }
        /**
         * However even if we get this token its possible that it could be
         * expired, for example if a user has stopped using the app for a
         * few hours and then come back.
         * If it is expired we should make a request to AWS for a new one
         * This might make the SSR take longer but this user would have
         * to do it client side anyway, and we mitigate this by only trying to do it
         * when the user has a token and it is expired
         */
        const isExpired = await tokenIsExpired(decodedIdToken.exp);

        if (isExpired || true) {
            /**
             * Amplify SDK at the moment does nto provide a nice way to refresh the
             * users token server side, this means that if the user makes a request with an
             * expired token then we will not be able to server side render any content
             * that requires authentication
             *
             * This is not 100% ideal but the main point of server side rendering is to
             * appease SEO and to show the user data as quick as possible. Since we can
             * accomplish both of these we wont worry about this too much
             */
            const refreshToken = authTokens?.refreshToken;

            if (!refreshToken) {
                log.err(
                    'Token was expired but the refresh token could not be found in the request cookies',
                );
                next();
                return;
            }

            log.err('Token was expired, refresh them and send to the server');
            const refreshResult = await manuallyRefreshTokens(authTokens);

            if (!refreshResult) {
                log.err('failed to get cookies in response from refresh mutation');
                next();
                return;
            }

            if (refreshResult.setCookieHeader) {
                log.info('Forwarding cookies from refresh request back to client');

                forwardCookies(res, refreshResult.setCookieHeader);

                const parsedCookies: Record<string, Cookie> = setCookieParser
                    .splitCookiesString(refreshResult.setCookieHeader)
                    .map((c) => setCookieParser.parse(c))
                    .flat()
                    .reduce<Record<string, Cookie>>((o, c) => {
                        o[c.name] = c;
                        return o;
                    }, {});

                if (
                    parsedCookies[IdentityCookies.IdToken] &&
                    parsedCookies[IdentityCookies.RefreshToken] &&
                    parsedCookies[IdentityCookies.AccessToken]
                ) {
                    tokens = {
                        refreshToken: parsedCookies[IdentityCookies.RefreshToken].value,
                        accessToken: parsedCookies[IdentityCookies.AccessToken].value,
                        idToken: parsedCookies[IdentityCookies.IdToken].value,
                    };
                    isLoggedIn = true;
                } else {
                    log.err('Failed to parse cookies from setCookie header');
                }
            }
        } else {
            log.info('Token is still valid');
            isLoggedIn = true;
            tokens = authTokens;
        }
    }

    res.locals.authTokens = tokens;
    res.locals.isLoggedIn = isLoggedIn;

    next();
};
