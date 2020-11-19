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
// @ts-ignore
import Amplify, { Auth } from 'aws-amplify';
import {permissions} from "./lib/authorization/rbac";
import {ApolloServer} from "apollo-server-micro";
import {performance} from "perf_hooks";

dotenv.config();

const a0 = performance.now();
const authorizer: IAuthorizer<CognitoAuthorizerConfig> = new CognitoAuthorizer(
    process.env.AMPLIFY_ISSUER || '',
    process.env.AMPLIFY_AUD || '',
    JSON.parse(process.env.AMPLIFY_JWK_RAW || '')
);
const a1 = performance.now();
console.log(`authorizer create: ${a1 - a0}`)

const p0 = performance.now();
const db = new PrismaClient();
const p1 = performance.now();
console.log(`prisma create: ${p1 - p0}`)

const ac0 = performance.now();
Amplify.configure({
    ...JSON.parse(process.env.NEXT_PUBLIC_AMPLIFY_CONFIG || ''),
    ssr: true
});
const ac1 = performance.now();
console.log(`amplify configure: ${ac1 - ac0}`)

const mes0 = performance.now();
const executableSchema = makeExecutableSchema({
    typeDefs: schema,
    resolvers: resolvers as any
});
const mes1 = performance.now();
console.log(`make executable schema ${mes1 - mes0}`)

const am0 = performance.now();
export const schemaWithPermissions = applyMiddleware(
    executableSchema,
    permissions
)
const am1 = performance.now();
console.log(`apply middleware: ${am1 - am0}`)

// @ts-ignore
export const context = ({req}): GQLContext => {
    const authTokens = getAuthTokens(req);

    const gas0 = performance.now();
    const authState = authorizer.getAuthState(authTokens);
    const gas1 = performance.now();
    console.log(`get auth state: ${gas1 - gas0}`)

    return {
        authorizer,
        authState,
        db,
        amplifyAuth: Auth
    }
}

const asc0 = performance.now();
const apolloServer = new ApolloServer({ schema: schemaWithPermissions, context });
const asc1 = performance.now();
console.log(`as create: ${asc1 - asc0}`)

export const serverlessHandler = apolloServer.createHandler({ path: '/api/graphql' })

/**
 * if you'd like to use this as a standalone server,
 * you can uncomment the following
 */

// import {ApolloServer} from 'apollo-server'
//
// const server = new ApolloServer({
//     schema: schemaWithPermissions,
//     context
// })
//
// server.listen().then(({ url }) => {
//     console.log(`Server running @ ${url}`);
// });
