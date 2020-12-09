import {ApolloClient, InMemoryCache, NormalizedCacheObject} from "@apollo/client";
import {setContext} from "@apollo/client/link/context";
import {createUploadLink} from 'apollo-upload-client'
import { BatchHttpLink } from "apollo-link-batch-http";

export const createApolloClient = (
    ssrMode: boolean,
    getIdToken: () => Promise<string>,
    initialStoreState: Object | null = null,
    uri: string = (process.env.PUBLIC_GRAPHQL_ENDPOINT || ''),
): ApolloClient<any> => {


    const authLink = setContext(async (_, req) => {
        return {
            headers: {
                ...req.headers,
                'x-id-token': await getIdToken() || ''
            }
        }
    });

    const terminatingLinkConfig = {
        uri, // Server URL (must be absolute)
        credentials: 'same-origin',
    };

    const terminatingLink = ssrMode ? new BatchHttpLink({
        ...terminatingLinkConfig, batchMax: 100, batchInterval: 50
    }) : createUploadLink(terminatingLinkConfig)

    return new ApolloClient({
        ssrMode,
        // @ts-ignore
        link: authLink.concat(terminatingLink),
        cache: initialStoreState
            ? new InMemoryCache({}).restore(initialStoreState as NormalizedCacheObject)
            : new InMemoryCache({}),
    })
    
}
