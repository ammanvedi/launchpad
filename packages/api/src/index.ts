import { schema } from './schema';
import { resolvers } from './lib/resolver/resolver';
import dotenv from 'dotenv';
import { GQLContext } from './lib/context/context';
import {
    CognitoAuthorizer,
    CognitoAuthorizerConfig,
    CognitoIdToken,
} from './lib/authorization/cognito-authorizer';
import { AuthTokens, IAuthorizer } from './lib/authorization/IAuthorizer';
import { applyMiddleware } from 'graphql-middleware';
import { makeExecutableSchema } from 'graphql-tools';
import Amplify from '@aws-amplify/core';
import Auth from '@aws-amplify/auth';
import { permissions } from './lib/authorization/rbac';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import AWS from 'aws-sdk';
import { loaders, prismaDb as db } from './lib/data/data';
import { MediaManager } from './lib/media/media-manager';
import { CloudinaryMediaManager } from './lib/media/cloudinary-media-manager';
import {
    clearAuthCookies,
    getAuthTokensFromRequest,
    setAuthCookiesOnResponse,
} from './lib/authorization/token';
import cookieParser from 'cookie-parser';

dotenv.config();

AWS.config.update({
    region: process.env.TF_VAR_aws_region,
    accessKeyId: process.env.TF_VAR_aws_access_key,
    secretAccessKey: process.env.TF_VAR_aws_secret_access_key,
});

const cognitoidentity = new AWS.CognitoIdentityServiceProvider({
    apiVersion: '2016-04-18',
});

const authorizer: IAuthorizer<
    CognitoAuthorizerConfig,
    CognitoIdToken
> = new CognitoAuthorizer({
    iss: `https://cognito-idp.${process.env.TF_VAR_aws_region}.amazonaws.com/${process.env.TF_VAR_aws_user_pool_id}`,
    aud: process.env.TF_VAR_aws_user_pool_client_id || '',
    cognito: cognitoidentity,
    userPoolId: process.env.TF_VAR_aws_user_pool_id || '',
    jwkUrl: `https://cognito-idp.${process.env.TF_VAR_aws_region}.amazonaws.com/${process.env.TF_VAR_aws_user_pool_id}/.well-known/jwks.json`,
    clientId: process.env.TF_VAR_aws_user_pool_client_id || '',
    oauthDomain: `${process.env.TF_VAR_user_pool_domain}.auth.${process.env.TF_VAR_aws_region}.amazoncognito.com`,
    signInCallbackUrl: process.env.TF_VAR_user_pool_sign_in_callback_url || '',
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
export const context = ({ req, res }): GQLContext => {
    const authTokens = getAuthTokensFromRequest(req);

    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-origin', process.env.TF_VAR_public_web_endpoint);

    const context: GQLContext = {
        authorizer,
        data: {
            db,
            loaders: loaders(),
        },
        amplifyAuth: Auth,
        mediaManager,
        authState: authorizer.getAuthState(authTokens),
        req,
        res,
        setAuthState(tokens) {
            this.authState = this.authorizer.getAuthState(tokens);
        },
    };

    return context as GQLContext;
};

const httpServer = express();

httpServer.use(cookieParser());

export const graphqlServer = new ApolloServer({
    schema: schemaWithPermissions,
    context,
});

httpServer.options('/*', function (req, res) {
    res.header('Access-Control-Allow-Origin', process.env.TF_VAR_public_web_endpoint);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, Content-Length, X-Requested-With, x-id-token',
    );
    res.send(200);
});

httpServer.get('/auth/callback/sign-in', async (req, res) => {
    const { code } = req.query;

    if (!code) {
        res.status(400);
        return;
    }

    try {
        const tokens = await authorizer.exchangeCodeForTokens(code as string);

        if (!tokens) {
            res.status(500);
            return;
        }

        setAuthCookiesOnResponse(
            tokens.idToken,
            tokens.accessToken,
            tokens.refreshToken,
            res,
            process.env.TF_VAR_auth_cookie_domain || '',
            parseInt(process.env.TF_VAR_auth_cookie_expiry_days || ''),
            process.env.TF_VAR_auth_cookie_secure === 'true',
        );

        res.redirect(302, process.env.TF_VAR_public_web_endpoint || '');
    } catch (e) {
        res.status(500);
    } finally {
        res.end();
    }
});

httpServer.post('/auth/token/refresh', async (req, res) => {
    const tokens = getAuthTokensFromRequest(req);

    if (!tokens) {
        res.status(400);
        res.end();
        return;
    }

    const newTokens = await authorizer.refreshTokens(tokens);

    if (!newTokens) {
        res.status(400);
        res.end();
        return;
    }

    setAuthCookiesOnResponse(
        newTokens.idToken,
        newTokens.accessToken,
        newTokens.refreshToken,
        res,
        process.env.TF_VAR_auth_cookie_domain || '',
        parseInt(process.env.TF_VAR_auth_cookie_expiry_days || ''),
        process.env.TF_VAR_auth_cookie_secure === 'true',
    );

    res.status(200);
    res.end();
});

httpServer.get('/auth/callback/sign-out', (req, res) => {
    clearAuthCookies(
        res,
        process.env.TF_VAR_auth_cookie_domain || '',
        process.env.TF_VAR_auth_cookie_secure === 'true',
    );

    res.redirect('');
});

graphqlServer.applyMiddleware({
    app: httpServer,
    path: '/',
});

const setup = Promise.all([
    authorizer.initialize(),
    mediaManager.createTempDir(process.env.TF_VAR_api_media_temp_folder || ''),
]);

setup.then(() => {
    httpServer.listen({ port: 4000 }, () => {
        console.log(
            `🚀 Server ready at http://localhost:4000${graphqlServer.graphqlPath}`,
        );
    });
});
