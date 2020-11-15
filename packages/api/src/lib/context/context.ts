import {AuthState, IAuthorizer} from "../authorization/IAuthorizer";
import {PrismaClient} from "@prisma/client";

export type GQLContext<AuthorizerConfig = any> = {
    authorizer: IAuthorizer<AuthorizerConfig>,
    db: PrismaClient,
    authState: AuthState
}

