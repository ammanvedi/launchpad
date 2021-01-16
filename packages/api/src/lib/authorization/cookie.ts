import { Response, CookieOptions, Request } from 'express';
import { AuthTokens } from './IAuthorizer';

enum IdentityCookies {
    IdToken = 'IdToken',
    AccessToken = 'AccessToken',
    RefreshToken = 'RefreshToken',
}

const getCookieExpiryDays = (days: number): Date => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    console.log(date, days);
    return date;
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
    console.log(cookieConfig);
    response.cookie(IdentityCookies.IdToken, idToken, cookieConfig);
    response.cookie(IdentityCookies.AccessToken, accessToken, cookieConfig);
    response.cookie(IdentityCookies.RefreshToken, refreshToken, cookieConfig);
};

export const getAuthTokensFromRequest = (request: Request): AuthTokens | null => {
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
