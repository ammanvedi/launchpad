import {Auth} from '@aws-amplify/auth';
import {ApolloClient, HttpLink, InMemoryCache} from "@apollo/client";
import {setContext} from "@apollo/client/link/context";
import Cookies from 'universal-cookie';

const idTokenRegex = /CognitoIdentityServiceProvider\.[0-9a-z]+\.[0-9a-z\-_A-Z]+\.idToken/

const getIdTokenFromRequest = (req:any): string | null => {
    //console.log('rrrrrr', req)
    const cookies = new Cookies(req.headers.cookie).getAll();
    const cookieNames = Object.keys(cookies);
    const idTokenCookie = cookieNames.find(name => idTokenRegex.test(name));
    if (idTokenCookie) {
        // @ts-ignore
        return cookies[idTokenCookie];
    }
    return null;
}

const getHeaders = async (auth: typeof Auth, req: any): Promise<object> => {
    try {
        let token;

        if (req) {
            token = getIdTokenFromRequest(req);
        } else {
            const session = await auth.currentSession();
            token = session.getIdToken().getJwtToken();
        }

        return token ? {
            'x-id-token': token
        } : {}
    } catch (e){
        return {}
    }

}

export const createApolloClient = (
    auth: typeof Auth,
    ssrMode: boolean,
    request: any = null,
    uri: string = (process.env.PUBLIC_GRAPHQL_ENDPOINT || ''),

): ApolloClient<any> => {

    const authLink = setContext(async (_, req) => {
        return {
            headers: {
                ...req.headers,
                ...(await getHeaders(auth, request))
            }
        }
    });

    const httpLink = new HttpLink({
        uri, // Server URL (must be absolute)
        credentials: 'same-origin'
    })

    return new ApolloClient({
        ssrMode,
        link: authLink.concat(httpLink),
        cache: new InMemoryCache({}),
    })
    
}
