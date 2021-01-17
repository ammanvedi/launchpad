import { Response, CookieOptions, Request } from 'express';
import { AuthTokens } from './IAuthorizer';
import { createLoggerSet } from '../logging/logger';

enum IdentityCookies {
    IdToken = 'IdToken',
    AccessToken = 'AccessToken',
    RefreshToken = 'RefreshToken',
    IsLoggedIn = 'IsLoggedIn',
}

enum IdentityHeaders {
    IdToken = 'x-id-token',
    AccessToken = 'x-access-token',
    RefreshToken = 'x-refresh-token',
}

const log = createLoggerSet('TokenHelpers');

const getCookieExpiryDays = (days: number): Date => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
};

export const clearAuthCookies = (
    idToken: string,
    accessToken: string,
    refreshToken: string,
    response: Response,
    domain: string,
    secure: boolean,
): void => {
    const cookieConfig: CookieOptions = {
        domain,
        secure,
        httpOnly: true,
        sameSite: 'lax',
    };
    response.clearCookie(IdentityCookies.IdToken, cookieConfig);
    response.clearCookie(IdentityCookies.AccessToken, cookieConfig);
    response.clearCookie(IdentityCookies.RefreshToken, cookieConfig);
    response.clearCookie(IdentityCookies.IsLoggedIn, {
        ...cookieConfig,
        httpOnly: false,
    });
};

export const setAuthCookiesOnResponse = (
    idToken: string,
    accessToken: string,
    refreshToken: string,
    response: Response,
    domain: string,
    expiresDays: number,
    secure: boolean,
): void => {
    const cookieConfig: CookieOptions = {
        domain,
        secure,
        httpOnly: true,
        sameSite: 'lax',
        expires: getCookieExpiryDays(expiresDays),
    };
    response.cookie(IdentityCookies.IdToken, idToken, cookieConfig);
    response.cookie(IdentityCookies.AccessToken, accessToken, cookieConfig);
    response.cookie(IdentityCookies.RefreshToken, refreshToken, cookieConfig);
    response.cookie(IdentityCookies.IsLoggedIn, 'true', {
        ...cookieConfig,
        httpOnly: false,
    });
};

const getAuthTokensFromCookies = (request: Request): AuthTokens | null => {
    const idToken = request.cookies[IdentityCookies.IdToken];
    const accessToken = request.cookies[IdentityCookies.AccessToken];
    const refreshToken = request.cookies[IdentityCookies.RefreshToken];

    if (idToken && accessToken && refreshToken) {
        return {
            idToken,
            accessToken,
            refreshToken,
        };
    }

    return null;
};

const getAuthTokensFromHeaders = (request: Request): AuthTokens | null => {
    const idToken = request.header(IdentityHeaders.IdToken);
    const accessToken = request.header(IdentityHeaders.AccessToken);
    const refreshToken = request.header(IdentityHeaders.RefreshToken);

    if (idToken && refreshToken && accessToken) {
        return {
            idToken,
            refreshToken,
            accessToken,
        };
    }

    return null;
};

export const getAuthTokensFromRequest = (request: Request): AuthTokens | null => {
    const tokensFromCookies = getAuthTokensFromCookies(request);

    if (tokensFromCookies) {
        log.info('Found auth tokens in request COOKIES');
        return tokensFromCookies;
    }

    const tokensFromHeaders = getAuthTokensFromHeaders(request);

    if (tokensFromHeaders) {
        log.info('Found auth tokens in request HEADERS');
        return tokensFromHeaders;
    }

    log.warn('Failed to find auth tokens in request');

    return null;
};
