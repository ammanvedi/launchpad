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
const { now } = require('perf_hooks').performance;

Amplify.configure({...JSON.parse(process.env.NEXT_PUBLIC_AMPLIFY_CONFIG || ''), ssr: true});

const manifest = require('../../../build/react-loadable-ssr-addon.json');

const helmetContext = {};
const routerContext = {};

const serverRenderer: any = () => async (
    req: express.Request & { store: Store },
    res: express.Response
) => {
    const modules = new Set();

    const a0 = now();
    const {Auth, Storage} = withSSRContext({req});
    const a1 = now()
    console.log(`ssr context get: ${a1 - a0}`);

    const b0 = now();
    const apolloClient = createApolloClient(Auth, true, req);
    const b1 = now()
    console.log(`create apollo client: ${b1 - b0}`);

    const c0 = now();
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
    const c1 = now()
    console.log(`create app tree: ${c1 - c0}`);

    // Apollo State
    const d0 = now();
    await getDataFromTree(AppTree);
    const d1 = now()
    console.log(`get data from tree: ${d1 - d0}`);

    const e0 = now();
    const apolloState = JSON.stringify(apolloClient.extract());
    const e1 = now()
    console.log(`json stringify: ${e1 - e0}`);

    // Redux State
    const f0 = now();
    const state = JSON.stringify(res.locals.store.getState());
    const f1 = now()
    console.log(`redux json stringify: ${f1 - f0}`);

    // Scripts
    const g0 = now();
    const bundles = getBundles(manifest, [...manifest.entrypoints, ...Array.from(modules)]);
    const styles = bundles.css || [];
    const scripts = bundles.js || [];
    const g1 = now()
    console.log(`get bundles: ${g1 - g0}`);


    const h0 = now();
    const content = renderToString(AppTree);
    const h1 = now()
    console.log(`rendertostring: ${h1 - h0}`);

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
