import * as React from 'react';
import * as express from 'express';
import { renderToString } from 'react-dom/server';
import { StaticRouter as Router } from 'react-router-dom';
import { Store } from 'redux';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { getBundles } from 'react-loadable-ssr-addon';
import Loadable from 'react-loadable';
import IntlProvider from '../../shared/i18n/IntlProvider';
import App from '../../shared/App';
import Html from '../components/HTML';
import Amplify from '@aws-amplify/core';
import {withSSRContext} from "aws-amplify";
import {createApolloClient} from "../../shared/graphql/apollo";
import {ApolloProvider} from "@apollo/client";
import {getDataFromTree} from "@apollo/client/react/ssr";
import {amplifyConfig} from "../../shared/amplify";

Amplify.configure({...amplifyConfig, ssr: true});

const manifest = require('../../../build/react-loadable-ssr-addon.json');

const helmetContext = {};
const routerContext = {};

const serverRenderer: any = () => async (
    req: express.Request & { store: Store },
    res: express.Response
) => {
    const modules = new Set();
    const {Auth} = withSSRContext({req});
    const apolloClient = createApolloClient(Auth, true, req);

    const AppTree = (
        <Loadable.Capture report={(moduleName: string) => modules.add(moduleName)}>
            <ApolloProvider client={apolloClient}>
                <Provider store={res.locals.store}>
                    <Router location={req.url} context={routerContext}>
                        <IntlProvider>
                            <HelmetProvider context={helmetContext}>
                                <App/>
                            </HelmetProvider>
                        </IntlProvider>
                    </Router>
                </Provider>
            </ApolloProvider>
        </Loadable.Capture>
    );

    // Apollo State
    await getDataFromTree(AppTree);
    const apolloState = JSON.stringify(apolloClient.extract());

    // Redux State
    const state = JSON.stringify(res.locals.store.getState());

    // Scripts
    const bundles = getBundles(manifest, [...manifest.entrypoints, ...Array.from(modules)]);
    const styles = bundles.css || [];
    const scripts = bundles.js || [];

    const content = renderToString(AppTree);

    return res.send(
        '<!doctype html>' +
        renderToString(
            <Html
                css={[
                    res.locals.assetPath('bundle.css'),
                    res.locals.assetPath('vendor.css'),
                    ...styles.map((s: any) => `/static/${s.file}`),
                ]}
                helmetContext={helmetContext}
                scripts={[
                    ...scripts.map((s: any) => `/static/${s.file}`),
                ]}
                state={state}
                apolloState={apolloState}
            >
                {content}
            </Html>
        )
    );
};

export default serverRenderer;
