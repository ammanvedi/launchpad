import {schema} from './schema';
import {ApolloServer} from 'apollo-server'
import {resolvers} from "./lib/resolver/resolver";
import dotenv from 'dotenv'
import {GQLContext} from "./lib/context/context";
import {CognitoAuthorizer} from "./lib/authorization/cognito-authorizer";

dotenv.config();

const authorizer = new CognitoAuthorizer();
const authorizerInit = authorizer.initialize({
    jwkUrl: process.env.AMPLIFY_JWK_URL || ''
})

Promise.all([authorizerInit]).then(() => {

    const server = new ApolloServer({
        typeDefs: schema,
        resolvers: resolvers as any,
        context: ( {
            authorizer
        } as GQLContext)
    })

    server.listen().then(({ url }) => {
        console.log(`Server running @ ${url}`);
    });
})
