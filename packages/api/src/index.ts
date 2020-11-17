import {schema} from './schema';
import {ApolloServer} from 'apollo-server'
import {resolvers} from "./lib/resolver/resolver";
import dotenv from 'dotenv'
import {GQLContext} from "./lib/context/context";
import {CognitoAuthorizer, CognitoAuthorizerConfig} from "./lib/authorization/cognito-authorizer";
import {IAuthorizer} from "./lib/authorization/IAuthorizer";
import {getAuthTokens} from "./lib/authorization/header";
import {applyMiddleware} from "graphql-middleware";
import { makeExecutableSchema } from 'graphql-tools';

import {PrismaClient} from "@prisma/client";
// @ts-ignore
import awsConfig from '../../app/src/aws-exports';
import Amplify, { Auth } from 'aws-amplify';
import {permissions} from "./lib/authorization/rbac";

dotenv.config();

const authorizer: IAuthorizer<CognitoAuthorizerConfig> = new CognitoAuthorizer(
    process.env.AMPLIFY_ISSUER || '',
    process.env.AMPLIFY_AUD || ''
);

const db = new PrismaClient();

Amplify.configure({
    ...awsConfig,
    ssr: true
});

const authorizerInit = authorizer.initialize({
    jwkUrl: process.env.AMPLIFY_JWK_URL || ''
});

const executableSchema = makeExecutableSchema({
    typeDefs: schema,
    resolvers: resolvers as any
});

const schemaWithPermissions = applyMiddleware(
    executableSchema,
    permissions
)

Promise.all([authorizerInit]).then(() => {

    const server = new ApolloServer({
        schema: schemaWithPermissions,
        context: ({req}): GQLContext => {

            const authTokens = getAuthTokens(req);
            const authState = authorizer.getAuthState(authTokens);

            return {
                authorizer,
                authState,
                db,
                amplifyAuth: Auth
            }
        }
    })

    server.listen().then(({ url }) => {
        console.log(`Server running @ ${url}`);
    });
})
