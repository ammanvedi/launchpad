import { Role } from '../../generated/graphql';

export type AuthState = {
    id: string;
    role: Role | '';
    email: string | '';
    externalUsername: string | '';
    sub: string | '';
    tokenExpiresAtUtcSecs: number;
    tokens: AuthTokens | null;
};

export type AuthTokens = {
    idToken: string;
    accessToken: string;
    refreshToken: string;
};

export interface IAuthorizer<
    Config extends Record<any, any>,
    IdTokenType extends Record<any, any>
> {
    initialize(): Promise<void>;
    validateToken(token: string): IdTokenType | false;
    getAuthState(tokens: AuthTokens | null): AuthState;
    refreshTokens(tokens: AuthTokens): Promise<AuthTokens | null>;
    signIn(username: string, password: string): Promise<AuthTokens | null>;
    exchangeCodeForTokens(code: string): Promise<AuthTokens | null>;
    determineAccessTokenExpiryUTC(token: string): string;
    linkExternalUserToInternalUser(
        externalId: string,
        internalId: string,
        role: Role,
    ): Promise<void>;
}
