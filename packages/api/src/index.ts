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
    region: process.env.AWS_DEFAULT_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const cognitoidentity = new AWS.CognitoIdentityServiceProvider({apiVersion: '2016-04-18'});

const authorizer: IAuthorizer<CognitoAuthorizerConfig> = new CognitoAuthorizer( {
    iss: process.env.AMPLIFY_ISSUER || '',
    aud: process.env.AMPLIFY_AUD || '',
    jwk: JSON.parse(process.env.AMPLIFY_JWK_RAW || ''),
    cognito: cognitoidentity,
    userPoolId: process.env.AWS_USER_POOL_ID || ''
});


const db = new PrismaClient();


Amplify.configure({
    ...JSON.parse(process.env.NEXT_PUBLIC_AMPLIFY_CONFIG || ''),
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

server.listen().then(({ url }) => {
    console.log(`Server running @ ${url}`);
});
