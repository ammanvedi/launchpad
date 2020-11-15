import {Role} from "../../generated/graphql";

export type AuthState = {
    id: string,
    role: Role | '',
    email: string | '',
}

export type AuthTokens = {
    idToken: string | null,
    accessToken: string | null
}

export interface IAuthorizer<Config extends Object> {
    initialize(config: Config): Promise<void>
    validateToken(token: string): boolean
    getAuthState(tokens: AuthTokens): AuthState
}