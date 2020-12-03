import {AuthState, IAuthorizer} from "../authorization/IAuthorizer";
import {PrismaClient} from "@prisma/client";
import {Auth} from 'aws-amplify';
import {DataLoaders} from "../data/data";

export type DatabaseAccessors = {
    db: PrismaClient,
    loaders: DataLoaders
}

export type GQLContext<AuthorizerConfig = any> = {
    authorizer: IAuthorizer<AuthorizerConfig>,
    data: DatabaseAccessors,
    authState: AuthState,
    amplifyAuth: typeof Auth
}

