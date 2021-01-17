import { Role } from '../../generated/graphql';

export type AuthState = {
    id: string;
    role: Role | '';
    email: string | '';
    externalUsername: string | '';
    sub: string | '';
    tokenExpiresAtUtcSecs: number;
    tokens: AuthTokens | null;
    tokenValidationError: TokenValidationError;
};

export type AuthTokens = {
    idToken: string;
    accessToken: string;
    refreshToken: string;
};

export enum TokenValidationError {
    Signature,
    Decode,
    JWK,
    Expiry,
    Unknown,
    Issuer,
    Aud,
    None,
}

export interface IAuthorizer<
    Config extends Record<any, any>,
    IdTokenType extends Record<any, any>
> {
    initialize(): Promise<void>;
    validateToken(token: string): IdTokenType | { err: TokenValidationError };
    getAuthState(tokens: AuthTokens | null): AuthState;
    refreshTokens(tokens: AuthTokens): Promise<AuthTokens | null>;

    signIn(username: string, password: string): Promise<AuthTokens | null>;
    signOutGlobal(username: string): Promise<void>;

    verifyEmailBegin(username: string): Promise<void>;
    verifyEmailComplete(code: string): Promise<void>;

    forgotPasswordBegin(username: string): Promise<void>;
    forgotPasswordComplete(
        code: string,
        newPassword: string,
        username: string,
    ): Promise<void>;

    setPasswordComplete(
        currentPassword: string,
        password: string,
        accessToken: string,
    ): Promise<void>;

    changeEmailBegin(newEmail: string, accessToken: string): Promise<void>;
    changeEmailComplete(code: string, accessToken: string): Promise<void>;

    verifyAttribute(attribute: string, code: string, accessToken: string): Promise<void>;

    signUpResendEmail(username: string): Promise<void>;
    signUpConfirmEmail(username: string, code: string): Promise<void>;

    exchangeCodeForTokens(code: string): Promise<AuthTokens | null>;
    determineAccessTokenExpiryUTC(token: string): string;
    linkExternalUserToInternalUser(
        externalId: string,
        internalId: string,
        role: Role,
    ): Promise<void>;
}
