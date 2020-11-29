import "regenerator-runtime/runtime";
import * as React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Loadable from 'react-loadable';

import { configureStore } from '../shared/store';
import App from '../shared/App';
import IntlProvider from '../shared/i18n/IntlProvider';
import createHistory from '../shared/store/history';
import Amplify from '@aws-amplify/core';
import {Auth} from '@aws-amplify/auth';
import {createApolloClient} from "../shared/graphql/apollo";
import {ApolloProvider} from "@apollo/client";
import {amplifyConfig} from "../shared/amplify";

const history = createHistory();

Amplify.configure({...amplifyConfig, ssr: true});

// Create/use the store
// history MUST be passed here if you want syncing between server on initial route
const store =
    window.store ||
    configureStore({
        initialState: window.__PRELOADED_STATE__,
    });

window.onload = () => {
    Loadable.preloadReady().then(() => {

        const apolloClient = createApolloClient(Auth, false);

        hydrate(
            <ApolloProvider client={apolloClient}>
                <Provider store={store}>
                    <Router history={history}>
                        <IntlProvider>
                            <HelmetProvider>
                                <App />
                            </HelmetProvider>
                        </IntlProvider>
                    </Router>
                </Provider>
            </ApolloProvider>
            ,
            document.getElementById('app')
        );
    });
};

if (process.env.NODE_ENV === 'development') {
    if (module.hot) {
        module.hot.accept();
    }

    if (!window.store) {
        window.store = store;
    }
}
