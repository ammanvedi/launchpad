import { AuthState, AuthTokens, IAuthorizer } from '../authorization/IAuthorizer';
import { PrismaClient } from '@prisma/client';
import { Auth } from 'aws-amplify';
import { DataLoaders } from '../data/data';
import { MediaManager } from '../media/media-manager';
import { CognitoIdToken } from '../authorization/cognito-authorizer';
import { Request, Response } from 'express';

export type DatabaseAccessors = {
    db: PrismaClient;
    loaders: DataLoaders;
};

export type GQLContext<AuthorizerConfig = any> = {
    setAuthState: (tokens: AuthTokens | null) => void;
    authorizer: IAuthorizer<AuthorizerConfig, CognitoIdToken>;
    data: DatabaseAccessors;
    authState: AuthState;
    amplifyAuth: typeof Auth;
    mediaManager: MediaManager;
    req: Request;
    res: Response;
};
