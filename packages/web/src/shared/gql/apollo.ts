import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { createUploadLink } from 'apollo-upload-client';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { AuthTokens, IdentityHeaders } from 'auth/types';

export const createApolloClient = (
    ssrMode: boolean,
    getTokens: (() => AuthTokens) | null,
    fetch: any = null,
    initialStoreState: Record<string, string> | null = null,
    uri: string = process.env.TF_VAR_public_graphql_endpoint || '',
): ApolloClient<any> => {
    const authLink = setContext(async (_, req) => {
        if (getTokens) {
            /**
             * When accessing through the browser the tokens are sent implicitly
             * through cookies, however in the ssr render we send the cookies through
             * headers
             */
            const tokens = getTokens();
            return {
                headers: {
                    ...req.headers,
                    [IdentityHeaders.RefreshToken]: tokens.refreshToken,
                    [IdentityHeaders.AccessToken]: tokens.accessToken,
                    [IdentityHeaders.IdToken]: tokens.idToken,
                },
            };
        }

        return {
            headers: {
                ...req.headers,
            },
        };
    });

    const terminatingLinkConfig = {
        uri, // Server URL (must be absolute)
        credentials: 'include',
    };

    const terminatingLink = ssrMode
        ? new BatchHttpLink({
              ...terminatingLinkConfig,
              batchMax: 100,
              batchInterval: 50,
              fetch,
          })
        : createUploadLink(terminatingLinkConfig);

    return new ApolloClient({
        ssrMode,
        // @ts-ignore
        link: authLink.concat(terminatingLink),
        cache: initialStoreState
            ? // @ts-ignore
              new InMemoryCache({}).restore(initialStoreState as NormalizedCacheObject)
            : new InMemoryCache({}),
    });
};
