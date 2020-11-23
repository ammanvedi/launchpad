import { useMemo } from 'react'
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { concatPagination } from '@apollo/client/utilities';
import {setContext} from "@apollo/client/link/context";
import merge from 'deepmerge'
import {Auth as ClientAuth, withSSRContext} from 'aws-amplify'

let apolloClient: ApolloClient<any>

export const getUserToken = (req: any) => {

}

const getHeaders = async (ctx: any): Promise<object> => {

    console.log('getHeaders: ', typeof window === 'undefined', !!ctx)

    try {
        if (typeof window === 'undefined') {

            if (!ctx) {
                return {}
            }

            const { Auth: ServerAuth } = withSSRContext(ctx);

            const session = await ServerAuth.currentSession();
            return {
                'x-id-token': session.getIdToken().getJwtToken()
            }
        }


        const session = await ClientAuth.currentSession();
        return {
            'x-id-token': session.getIdToken().getJwtToken()
        }
    } catch (e) {
        console.log(e)
        return {}
    }

}

const authLink = (reqCtx: any) => setContext(async (_, req) => {
    console.log('authLink: ', typeof window === 'undefined', !!reqCtx)
    return {
        headers: {
            ...req.headers,
            ...(await getHeaders(reqCtx))
        }
    }
});

const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT, // Server URL (must be absolute)
    credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers`,
})


function createApolloClient(ctx) {

    const isSsr = typeof window === 'undefined'

    console.log('createApolloClient: ', isSsr, !!ctx)

    return new ApolloClient({
        ssrMode: isSsr,
        link: authLink(isSsr ? ctx : null).concat(httpLink),
        cache: new InMemoryCache({}),
    })
}

export function getApolloClient(ctx, initialState = null) {
    const _apolloClient = apolloClient ?? createApolloClient(ctx)

    console.log(initialState)

    // If your page has Next.js data fetching methods that use Apollo Client, the initial state
    // get hydrated here
    if (initialState) {
        // Get existing cache, loaded during client side data fetching
        const existingCache = _apolloClient.extract()

        // Merge the existing cache into data passed from getStaticProps/getServerSideProps
        const data = merge(initialState, existingCache)

        // Restore the cache with the merged data
        _apolloClient.cache.restore(data)
    }
    // For SSG and SSR always create a new Apollo Client
    // this statement means we will never end up caching the client
    if (typeof window === 'undefined') return _apolloClient
    // Create the Apollo Client once in the client
    if (!apolloClient) apolloClient = _apolloClient

    return _apolloClient
}

export function useApollo(initialState) {
    console.log('useapollo', typeof window === 'undefined')
    const store = useMemo(() => getApolloClient(null, initialState), [initialState])
    return store
}