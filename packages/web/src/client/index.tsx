import 'regenerator-runtime/runtime';
import * as React from 'react';
import { hydrate } from 'react-dom';
import { Router } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from '../shared/App';
import createHistory from 'history/history';
import Amplify from '@aws-amplify/core';
import { Auth } from '@aws-amplify/auth';
import { createApolloClient } from '../shared/graphql/apollo';
import { ApolloProvider } from '@apollo/client';
import { amplifyAuthConfig, amplifyConfig } from '../shared/amplify';
import { RecoilRoot } from 'recoil';
import atoms from '../shared/state/atom';
import { loadableReady } from '@loadable/component';
import { isLoggedInSync } from 'auth/helpers';

const history = createHistory();

Auth.configure({
    Auth: amplifyAuthConfig,
});

Amplify.configure({ ...amplifyConfig, ssr: true });

const checkIsLoggedIn = () => {
    return isLoggedInSync(document.cookie || '');
};

loadableReady(() => {
    const apolloClient = createApolloClient(false, null, window.__APOLLO_STATE__);

    hydrate(
        <ApolloProvider client={apolloClient}>
            <RecoilRoot
                initializeState={({ set }) => {
                    const initialState = window.__PRELOADED_RECOIL_STATE__;
                    const initialStateKeys = Object.keys(initialState);
                    initialStateKeys.forEach((k) => {
                        set(atoms[k], initialState[k]);
                    });
                }}
            >
                <Router history={history}>
                    <HelmetProvider>
                        <App checkIsLoggedIn={checkIsLoggedIn} />
                    </HelmetProvider>
                </Router>
            </RecoilRoot>
        </ApolloProvider>,
        document.getElementById('app'),
    );
});

if (process.env.NODE_ENV === 'development') {
    if (module.hot) {
        module.hot.accept();
    }
}
