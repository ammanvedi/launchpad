import {schema} from './schema';
import {resolvers} from "./lib/resolver/resolver";
import dotenv from 'dotenv'
import {GQLContext} from "./lib/context/context";
import {CognitoAuthorizer, CognitoAuthorizerConfig} from "./lib/authorization/cognito-authorizer";
import {IAuthorizer} from "./lib/authorization/IAuthorizer";
import {getAuthTokens} from "./lib/authorization/header";
import {applyMiddleware} from "graphql-middleware";
import { makeExecutableSchema } from 'graphql-tools';
import {PrismaClient} from "@prisma/client";
import Amplify from '@aws-amplify/core';
import Auth from '@aws-amplify/auth';
import {permissions} from "./lib/authorization/rbac";
import {ApolloServer} from 'apollo-server';
import AWS from 'aws-sdk';

dotenv.config();

AWS.config.update({
    region: process.env.TF_VAR_aws_region,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const cognitoidentity = new AWS.CognitoIdentityServiceProvider({apiVersion: '2016-04-18'});

const authorizer: IAuthorizer<CognitoAuthorizerConfig> = new CognitoAuthorizer( {
    iss: `https://cognito-idp.${process.env.TF_VAR_aws_region}.amazonaws.com/${process.env.AWS_USER_POOL_ID}`,
    aud: process.env.AWS_USER_POOLS_WEB_CLIENT_ID || '',
    cognito: cognitoidentity,
    userPoolId: process.env.AWS_USER_POOL_ID || '',
    jwkUrl: `https://cognito-idp.${process.env.TF_VAR_aws_region}.amazonaws.com/${process.env.AWS_USER_POOL_ID}/.well-known/jwks.json`
});


const db = new PrismaClient();

const amplifyConfig = {
    aws_project_region: process.env.TF_VAR_aws_region,
    aws_cognito_region: process.env.TF_VAR_aws_region,
    aws_user_pools_id: process.env.AWS_USER_POOL_ID,
    aws_user_pools_web_client_id: process.env.AWS_USER_POOLS_WEB_CLIENT_ID,
    oauth: {
        domain: `${process.env.TF_VAR_user_pool_domain}.auth.${process.env.TF_VAR_aws_region}.amazoncognito.com`,
        scope:[
            "phone",
            "email",
            "openid",
            "profile",
            "aws.cognito.signin.user.admin"
        ],
        redirectSignIn: process.env.TF_VAR_sign_in_callback_url,
        redirectSignOut: process.env.TF_VAR_sign_out_callback_url,
        responseType: "code"
    },
    federationTarget :"COGNITO_USER_POOLS"
};

Amplify.configure({
    ...amplifyConfig,
    ssr: true
});

const executableSchema = makeExecutableSchema({
    typeDefs: schema,
    resolvers: resolvers as any
});

export const schemaWithPermissions = applyMiddleware(
    executableSchema,
    permissions
)

// @ts-ignore
export const context = ({req}): GQLContext => {
    const authTokens = getAuthTokens(req);

    const authState = authorizer.getAuthState(authTokens);


    return {
        authorizer,
        authState,
        db,
        amplifyAuth: Auth
    }
}

export const server = new ApolloServer({
    schema: schemaWithPermissions,
    context
});

authorizer.initialize()
    .then(() => server.listen())
    .then(({ url }) => {
        console.log(`Server running @ ${url}`);
    });
