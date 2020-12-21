import { Response } from 'express';
import Cookies from 'universal-cookie';
import { amplifyAuthConfig, COGNITO_URL } from 'amplify';
import fetch from 'node-fetch';
import * as express from 'express';
import { createLoggerSet } from '../../../../api/src/lib/logging/logger';

type CookieType = 'idToken' | 'refreshToken' | 'accessToken';

export const getTokenTypeRegex = (type: CookieType, clientId: string): RegExp => {
    return new RegExp(
        `CognitoIdentityServiceProvider\\.${clientId}\\.[0-9a-z\\-_A-Z]+\\.${type}`,
    );
};

export const getTokenTypeFromRequest = (
    cookiesData: Cookies,
    type: CookieType,
    clientId: string,
): string | null => {
    const desiredRegex = getTokenTypeRegex(type, clientId);
    const cookies = cookiesData.getAll();
    const cookieNames = Object.keys(cookies);
    const desiredCookie = cookieNames.find((name) => desiredRegex.test(name));
    if (desiredCookie) {
        // @ts-ignore
        return cookies[desiredCookie];
    }
    return null;
};

/**
 * Check if the user has an idToken in their cookies, if they do
 * then we assert that they are logged in and that authenticated requests
 * should succeed
 *
 * cookieString should be equivalent to document.cookie
 */
export const isLoggedInSync = (
    cookieString: string,
    tokenType: CookieType = 'idToken',
    clientId: string = process.env.TF_VAR_aws_user_pool_client_id || '',
): boolean => {
    const idTokenRegex = getTokenTypeRegex(tokenType, clientId);
    return idTokenRegex.test(cookieString);
};

const generateCookieName = (
    username: string, // e.g. adb95c47-ed10-41e6-84f1-ad4697040f6e
    clientId: string, // e.g. 64r8amojc8k3col1e616srig01
    type: CookieType,
): string => {
    return `CognitoIdentityServiceProvider.${clientId}.${username}.${type}`;
};

type CookieData = {
    name: string;
    value: string;
};

export const generateCookies = (
    { AuthenticationResult: { AccessToken, IdToken, RefreshToken } }: ManualTokenResponse,
    clientId: string,
    username: string,
): Array<CookieData> => {
    const nameGen = generateCookieName.bind(null, username, clientId);

    const c = [
        {
            name: nameGen('accessToken'),
            value: AccessToken,
        },
        {
            name: nameGen('idToken'),
            value: IdToken,
        },
    ];

    if (RefreshToken) {
        c.push({
            name: nameGen('refreshToken'),
            value: RefreshToken,
        });
    }

    return c;
};

type IdToken = {
    exp: number;
    sub: string;
    client_id: string;
};

export const decodeToken = async (token: string): Promise<IdToken | null> => {
    try {
        const { decode } = await import('jsonwebtoken');
        return decode(token) as IdToken;
    } catch {
        return null;
    }
};

// exp is unix time in seconds
export const tokenIsExpired = async (exp: number): Promise<boolean> => {
    const now = new Date().getTime() / 1000;
    return now > exp;
};

type ManualTokenResponse = {
    AuthenticationResult: {
        AccessToken: string;
        ExpiresIn: number;
        IdToken: string;
        RefreshToken: string;
        TokenType: string;
    };
};

export const manuallyRefreshTokens = async (
    refreshToken: string,
    clientId: string,
    url = COGNITO_URL,
): Promise<ManualTokenResponse | null> => {
    const body = JSON.stringify({
        ClientId: clientId,
        AuthFlow: 'REFRESH_TOKEN_AUTH',
        AuthParameters: {
            REFRESH_TOKEN: refreshToken,
        },
    });

    try {
        const result: ManualTokenResponse = await fetch(url, {
            method: 'post',
            body,
            headers: {
                'Content-Type': 'application/x-amz-json-1.1',
                'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth',
            },
        }).then((res) => res.json());

        return result;
    } catch (e) {
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

export const setAuthCookies = (res: Response, cookies: Array<CookieData>): void => {
    cookies.forEach(({ name, value }) => {
        res.cookie(name, value, {
            ...amplifyAuthConfig.cookieStorage,
            expires: getExpires(amplifyAuthConfig.cookieStorage.expires),
        });
    });
};

export const getExpires = (days: number) => {
    const result = new Date();
    result.setDate(result.getDate() + days);
    return result;
};
