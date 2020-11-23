import {Auth} from '@aws-amplify/auth';
import {ApolloClient, HttpLink, InMemoryCache} from "@apollo/client";
import {setContext} from "@apollo/client/link/context";

const getHeaders = async (auth: typeof Auth): Promise<object> => {
    try {
        const session = await auth.currentSession();
        return {
            'x-id-token': session.getIdToken().getJwtToken()
        }
    } catch {
        return {}
    }

}

export const createApolloClient = (
    auth: typeof Auth,
    ssrMode: boolean,
    uri: string = (process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || ''),
): ApolloClient<any> => {

    const authLink = setContext(async (_, req) => {
        return {
            headers: {
                ...req.headers,
                ...(await getHeaders(auth))
            }
        }
    });

    const httpLink = new HttpLink({
        uri, // Server URL (must be absolute)

    })

    return new ApolloClient({
        ssrMode,
        link: authLink.concat(httpLink),
        cache: new InMemoryCache({}),
    })
    
}
