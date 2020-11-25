import {Role} from "../../generated/graphql";

export type AuthState = {
    id: string,
    role: Role | '',
    email: string | '',
    externalUsername: string | '',
    sub: string | '',
}

export type AuthTokens = {
    idToken: string | null,
}

export interface IAuthorizer<Config extends Object> {
    validateToken(token: string): boolean
    getAuthState(tokens: AuthTokens): AuthState
    linkExternalUserToInternalUser(externalId: string, internalId: string, role: Role): Promise<void>;
}