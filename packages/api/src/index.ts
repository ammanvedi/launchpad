import { schema } from './schema';
import { resolvers } from './lib/resolver/resolver';
import dotenv from 'dotenv';
import { GQLContext } from './lib/context/context';
import {
    CognitoAuthorizer,
    CognitoAuthorizerConfig,
} from './lib/authorization/cognito-authorizer';
import { IAuthorizer } from './lib/authorization/IAuthorizer';
import { getAuthTokens } from './lib/authorization/header';
import { applyMiddleware } from 'graphql-middleware';
import { makeExecutableSchema } from 'graphql-tools';
import Amplify from '@aws-amplify/core';
import Auth from '@aws-amplify/auth';
import { permissions } from './lib/authorization/rbac';
import { ApolloServer } from 'apollo-server';
import AWS from 'aws-sdk';
import { loaders, prismaDb as db } from './lib/data/data';
import { MediaManager } from './lib/media/media-manager';
import { CloudinaryMediaManager } from './lib/media/cloudinary-media-manager';

dotenv.config();

AWS.config.update({
    region: process.env.TF_VAR_aws_region,
    accessKeyId: process.env.TF_VAR_aws_access_key,
    secretAccessKey: process.env.TF_VAR_aws_secret_access_key,
});

const cognitoidentity = new AWS.CognitoIdentityServiceProvider({
    apiVersion: '2016-04-18',
});

const authorizer: IAuthorizer<CognitoAuthorizerConfig> = new CognitoAuthorizer({
    iss: `https://cognito-idp.${process.env.TF_VAR_aws_region}.amazonaws.com/${process.env.TF_VAR_aws_user_pool_id}`,
    aud: process.env.TF_VAR_aws_user_pool_client_id || '',
    cognito: cognitoidentity,
    userPoolId: process.env.TF_VAR_aws_user_pool_id || '',
    jwkUrl: `https://cognito-idp.${process.env.TF_VAR_aws_region}.amazonaws.com/${process.env.TF_VAR_aws_user_pool_id}/.well-known/jwks.json`,
});

const mediaManager: MediaManager = new CloudinaryMediaManager({
    cloudName: process.env.TF_VAR_cloudinary_cloud_name || '',
    apiSecret: process.env.TF_VAR_cloudinary_secret_key || '',
    apiKey: process.env.TF_VAR_cloudinary_key || '',
});

const amplifyConfig = {
    aws_project_region: process.env.TF_VAR_aws_region,
    aws_cognito_region: process.env.TF_VAR_aws_region,
    aws_user_pools_id: process.env.TF_VAR_aws_user_pool_id,
    aws_user_pools_web_client_id: process.env.TF_VAR_aws_user_pool_client_id,
    oauth: {
        domain: `${process.env.TF_VAR_user_pool_domain}.auth.${process.env.TF_VAR_aws_region}.amazoncognito.com`,
        scope: ['phone', 'email', 'openid', 'profile', 'aws.cognito.signin.user.admin'],
        redirectSignIn: process.env.TF_VAR_sign_in_callback_url,
        redirectSignOut: process.env.TF_VAR_sign_out_callback_url,
        responseType: 'code',
    },
    federationTarget: 'COGNITO_USER_POOLS',
};

Amplify.configure({
    ...amplifyConfig,
    ssr: true,
});

const executableSchema = makeExecutableSchema({
    typeDefs: schema,
    resolvers: resolvers as any,
});

export const schemaWithPermissions = applyMiddleware(executableSchema, permissions);

// @ts-ignore
export const context = ({ req }): GQLContext => {
    const authTokens = getAuthTokens(req);

    const authState = authorizer.getAuthState(authTokens);

    return {
        authorizer,
        authState,
        data: {
            db,
            loaders: loaders(),
        },
        amplifyAuth: Auth,
        mediaManager,
    };
};

export const server = new ApolloServer({
    schema: schemaWithPermissions,
    context,
});

const setup = Promise.all([
    authorizer.initialize(),
    mediaManager.createTempDir(process.env.TF_VAR_api_media_temp_folder || ''),
]);

setup
    .then(() => server.listen())
    .then(({ url }) => {
        console.log(`Server running @ ${url}`);
    });
