import {Auth} from '@aws-amplify/auth';
import {ApolloClient, HttpLink, InMemoryCache, NormalizedCacheObject} from "@apollo/client";
import {setContext} from "@apollo/client/link/context";
import {createUploadLink} from 'apollo-upload-client'
import {getIdTokenFromRequest, tokenIsExpired} from "auth/helpers";
import {createLoggerSet} from "../../../../api/src/lib/logging/logger";

const log = createLoggerSet('ApolloClient');

const getHeaders = async (auth: typeof Auth, req: any): Promise<object> => {
    try {
        let token;

        if (req) {
            /**
             * Now we are on the server side and we have the express request info
             * the fastest way to get the token is to read it as a cookie
             */
            const cookieToken = getIdTokenFromRequest(req);
            if (cookieToken) {
                log.info('Found a Cognito cookie in request');
                /**
                 * However even if we get this token its possible that it could be
                 * expired, for example if a user has stopped using the app for a
                 * few hours and then come back.
                 * If it is expired we should make a request to AWS for a new one
                 * This might make the SSR take longer but this user would have
                 * to do it client side anyway, and we mitigate this by only trying to do it
                 * when the user has a token and it is expired
                 */
                const isExpired = await tokenIsExpired(cookieToken);

                if(isExpired) {
                    /**
                     * Amplify SDK at the moment does nto provide a nice way to refresh the
                     * users token server side, this means that if the user makes a request with an
                     * expired token then we will not be able to server side render any content
                     * that requires authentication
                     *
                     * This is not 100% ideal but the main point of server side rendering is to
                     * appease SEO and to show the user data as quick as possible. Since we can
                     * accomplish both of these we wont worry about this too much
                     */
                    log.err('Token was expired, refresh them and send to the server');
                } else {
                    log.info('Token is still valid')
                    token = cookieToken;
                }
            }
        } else {
            log.info('In browser, get current session')
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
    initialStoreState: Object | null = null,
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

    const terminatingLinkConfig = {
        uri, // Server URL (must be absolute)
        credentials: 'same-origin',
    };

    const terminatingLink = ssrMode ? new HttpLink(terminatingLinkConfig) : createUploadLink(terminatingLinkConfig)

    return new ApolloClient({
        ssrMode,
        link: authLink.concat(terminatingLink),
        cache: initialStoreState
            ? new InMemoryCache({}).restore(initialStoreState as NormalizedCacheObject)
            : new InMemoryCache({}),
    })
    
}
