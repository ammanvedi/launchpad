import "regenerator-runtime/runtime";
import * as React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import { configureStore } from '../shared/store';
import App from '../shared/App';
import IntlProvider from '../shared/i18n/IntlProvider';
import createHistory from '../shared/store/history';
import Amplify from '@aws-amplify/core';
import {Auth} from '@aws-amplify/auth';
import {createApolloClient} from "../shared/graphql/apollo";
import {ApolloProvider} from "@apollo/client";
import {amplifyAuthConfig, amplifyConfig} from "../shared/amplify";
import {RecoilRoot} from "recoil";
import atoms from '../shared/state/atom';
import { loadableReady } from '@loadable/component'

const history = createHistory();

Auth.configure({
    Auth: amplifyAuthConfig
});

Amplify.configure({...amplifyConfig, ssr: true});


const store =
    window.store ||
    configureStore({
        initialState: window.__PRELOADED_STATE__,
    });

loadableReady(() => {
    const getIdToken = async () => {
        const session = await Auth.currentSession();
        return session.getIdToken().getJwtToken();
    }

    const apolloClient = createApolloClient(false, getIdToken, window.__APOLLO_STATE__);

    hydrate(
        <ApolloProvider client={apolloClient}>
            <RecoilRoot initializeState={({set}) => {
                const initialState = window.__PRELOADED_RECOIL_STATE__
                const initialStateKeys = Object.keys(initialState);
                initialStateKeys.forEach(k => {
                    // @ts-ignore
                    set(atoms[k], initialState[k])
                })
            }}>
                <Provider store={store}>
                    <Router history={history}>
                        <IntlProvider>
                            <HelmetProvider>
                                <App />
                            </HelmetProvider>
                        </IntlProvider>
                    </Router>
                </Provider>
            </RecoilRoot>
        </ApolloProvider>
        ,
        document.getElementById('app')
    );
})

if (process.env.NODE_ENV === 'development') {
    if (module.hot) {
        module.hot.accept();
    }

    if (!window.store) {
        window.store = store;
    }
}
