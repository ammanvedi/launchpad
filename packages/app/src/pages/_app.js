import '../../styles/globals.css';
import Amplify from '@aws-amplify/core';
import Auth from '@aws-amplify/auth';
import { ApolloProvider } from '@apollo/client'
import { Provider } from 'react-redux'
import { useStore } from '../lib/redux'
import { useApollo } from '../lib/apollo'

Amplify.configure({...JSON.parse(process.env.NEXT_PUBLIC_AMPLIFY_CONFIG), ssr: true});

function MyApp({ Component, pageProps }) {
  const store = useStore(pageProps.initialReduxState)
  const apolloClient = useApollo(pageProps.apolloState)

  return (
      <Provider store={store}>
        <ApolloProvider client={apolloClient}>
          <Component {...pageProps} />
        </ApolloProvider>
      </Provider>
  )
}

export default MyApp
