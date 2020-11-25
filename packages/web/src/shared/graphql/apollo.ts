import {Auth} from '@aws-amplify/auth';
import {ApolloClient, HttpLink, InMemoryCache} from "@apollo/client";
import {setContext} from "@apollo/client/link/context";
import Cookies from 'universal-cookie';

const idTokenRegex = /CognitoIdentityServiceProvider\.[0-9a-z]+\.[0-9a-z\-_A-Z]+\.idToken/

const getIdTokenFromRequest = (req:any): string | null => {
    //console.log('rrrrrr', req)
    const cookies = new Cookies(req.headers.cookie).getAll();
    console.log('coookies', cookies);
    const cookieNames = Object.keys(cookies);
    const idTokenCookie = cookieNames.find(name => idTokenRegex.test(name));
    if (idTokenCookie) {
        // @ts-ignore
        console.log('found', cookies[idTokenCookie])
        return cookies[idTokenCookie];
    }
    return null;
}

const getHeaders = async (auth: typeof Auth, req: any): Promise<object> => {
    console.log('calling')
    const b0 = new Date().getTime();
    try {
        let token;

        if (req) {
            token = getIdTokenFromRequest(req);
        } else {
            const session = await auth.currentSession();
            token = session.getIdToken().getJwtToken();
        }
        const b1 = new Date().getTime();
        console.log(`currentAuthenticatedUser: ${b1 - b0}`);


        return token ? {
            'x-id-token': token
        } : {}
    } catch (e){
        console.log('ERROR', e)
        return {}
    }

}

export const createApolloClient = (
    auth: typeof Auth,
    ssrMode: boolean,
    request: any = null,
    uri: string = (process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || ''),

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
