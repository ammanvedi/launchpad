export type IdToken = {
    exp: number;
    sub: string;
    client_id: string;
};

export enum IdentityCookies {
    IdToken = 'IdToken',
    AccessToken = 'AccessToken',
    RefreshToken = 'RefreshToken',
    IsLoggedIn = 'IsLoggedIn',
}

export enum IdentityHeaders {
    IdToken = 'x-id-token',
    AccessToken = 'x-access-token',
    RefreshToken = 'x-refresh-token',
}

export type AuthTokens = {
    idToken: string;
    accessToken: string;
    refreshToken: string;
};
