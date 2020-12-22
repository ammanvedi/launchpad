import * as express from 'express';
import Cookies from 'universal-cookie';
import { createLoggerSet } from '../../../../api/src/lib/logging/logger';
import {
    generateCookies,
    getTokenTypeFromRequest,
    manuallyRefreshTokens,
    setAuthCookies,
    tokenIsExpired,
} from '../../shared/auth/helpers';
import { decode } from 'jsonwebtoken';

type IdToken = {
    exp: number;
    sub: string;
    client_id: string;
};

export const decodeToken = async (token: string): Promise<IdToken | null> => {
    try {
        return decode(token) as IdToken;
    } catch {
        return null;
    }
};

const log = createLoggerSet('UseKeepTokensFresh');

export const keepTokensFresh = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
): Promise<void> => {
    //res.locals.store = configureStore({});

    let token;
    let isLoggedIn = false;

    /**
     * Now we are on the server side and we have the express request info
     * the fastest way to get the token is to read it as a cookie
     */
    const cookies = new Cookies(req.headers.cookie);
    const idToken = getTokenTypeFromRequest(
        cookies,
        'idToken',
        process.env.AWS_USER_POOLS_WEB_CLIENT_ID || '',
    );

    if (idToken) {
        log.info('Found a Cognito cookie in request');
        const decodedIdToken = await decodeToken(idToken);

        if (!decodedIdToken) {
            log.info('Found a cookie but failed to parse it');
            return;
        }
        isLoggedIn = true;
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

        if (isExpired) {
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
            const refreshToken = getTokenTypeFromRequest(
                cookies,
                'refreshToken',
                process.env.AWS_USER_POOLS_WEB_CLIENT_ID || '',
            );

            if (!refreshToken) {
                log.err(
                    'Token was expired but the refresh token could not be found in the request cookies',
                );
                return;
            }

            log.err('Token was expired, refresh them and send to the server');
            const newTokens = await manuallyRefreshTokens(
                refreshToken,
                process.env.AWS_USER_POOLS_WEB_CLIENT_ID || '',
            );

            if (!newTokens) {
                log.err('failed to fetch new tokens from cognito');
                return;
            }

            const responseCookies = generateCookies(
                newTokens,
                process.env.AWS_USER_POOLS_WEB_CLIENT_ID || '',
                decodedIdToken.sub,
            );

            setAuthCookies(res, responseCookies);

            token = newTokens.AuthenticationResult.IdToken;
        } else {
            log.info('Token is still valid');
            token = idToken;
        }
    }

    res.locals.idToken = token;
    res.locals.isLoggedIn = isLoggedIn;

    next();
};
