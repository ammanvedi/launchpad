import { AuthState, IAuthorizer } from '../authorization/IAuthorizer';
import { PrismaClient } from '@prisma/client';
import { Auth } from 'aws-amplify';
import { DataLoaders } from '../data/data';
import { MediaManager } from '../media/media-manager';

export type DatabaseAccessors = {
    db: PrismaClient;
    loaders: DataLoaders;
};

export type GQLContext<AuthorizerConfig = any> = {
    authorizer: IAuthorizer<AuthorizerConfig>;
    data: DatabaseAccessors;
    authState: AuthState;
    amplifyAuth: typeof Auth;
    mediaManager: MediaManager;
};
