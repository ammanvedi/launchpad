import {Auth} from '@aws-amplify/auth';
import {ApolloClient, HttpLink, InMemoryCache} from "@apollo/client";
import {setContext} from "@apollo/client/link/context";


const getHeaders = async (auth: typeof Auth, ssrMode: boolean = false): Promise<object> => {
    console.log('calling')
    try {
        const b0 = new Date().getTime();
        const session = await auth.currentSession();
        const b1 = new Date().getTime();
        console.log(`currentAuthenticatedUser: ${b1 - b0}`);
        const token = session.getIdToken().getJwtToken();

        return {
            'x-id-token': token
        }
    } catch (e){
        console.log(e)
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
