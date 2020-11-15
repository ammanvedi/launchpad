import {AuthState, IAuthorizer} from "../authorization/IAuthorizer";
import {PrismaClient} from "@prisma/client";
import { Auth } from 'aws-amplify';

export type GQLContext<AuthorizerConfig = any> = {
    authorizer: IAuthorizer<AuthorizerConfig>,
    db: PrismaClient,
    authState: AuthState,
    amplifyAuth: typeof Auth
}

