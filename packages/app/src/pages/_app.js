import '../../styles/globals.css';
import Amplify, { Auth } from 'aws-amplify';
import awsconfig from '../aws-exports';
import { ApolloProvider } from '@apollo/client'
import { Provider } from 'react-redux'
import { useStore } from '../lib/redux'
import { useApollo } from '../lib/apollo'

Amplify.configure({...awsconfig, ssr: true});

function MyApp({ Component, pageProps }) {
  const store = useStore(pageProps.initialReduxState)
  const apolloClient = useApollo(pageProps.initialApolloState)

  return (
      <Provider store={store}>
        <ApolloProvider client={apolloClient}>
          <Component {...pageProps} />
        </ApolloProvider>
      </Provider>
  )
}

export default MyApp
