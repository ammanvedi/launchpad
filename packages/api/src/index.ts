import {schema} from './schema';
import {ApolloServer} from 'apollo-server'
import {resolvers} from "./lib/resolver/resolver";
import dotenv from 'dotenv'
import {GQLContext} from "./lib/context/context";
import {CognitoAuthorizer, CognitoAuthorizerConfig} from "./lib/authorization/cognito-authorizer";
import {IAuthorizer} from "./lib/authorization/IAuthorizer";
import {getAuthTokens} from "./lib/authorization/header";
import {rbacExtension} from "./lib/authorization/rbac";
import {PrismaClient} from "@prisma/client";
// @ts-ignore
import awsConfig from '../../app/src/aws-exports';
import Amplify, { Auth } from 'aws-amplify';

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
})

Promise.all([authorizerInit]).then(() => {

    const server = new ApolloServer({
        typeDefs: schema,
        resolvers: resolvers as any,
        plugins: [
            rbacExtension
        ],
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
