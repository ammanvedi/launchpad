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

const history = createHistory();

Amplify.configure({...JSON.parse(process.env.NEXT_PUBLIC_AMPLIFY_CONFIG || ''), ssr: true});

// Create/use the store
// history MUST be passed here if you want syncing between server on initial route
const store =
    window.store ||
    configureStore({
        initialState: window.__PRELOADED_STATE__,
    });

window.onload = () => {
    Loadable.preloadReady().then(() => {
        hydrate(
            <Provider store={store}>
                <Router history={history}>
                    <IntlProvider>
                        <HelmetProvider>
                            <App />
                        </HelmetProvider>
                    </IntlProvider>
                </Router>
            </Provider>,
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
