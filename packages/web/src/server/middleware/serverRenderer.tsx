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

const manifest = require('../../../build/react-loadable-ssr-addon.json');

const helmetContext = {};
const routerContext = {};

const serverRenderer: any = () => (
    req: express.Request & { store: Store },
    res: express.Response
) => {
    const modules = new Set();

    const content = renderToString(
        <Loadable.Capture report={(moduleName: string) => modules.add(moduleName)}>
            <Provider store={res.locals.store}>
                <Router location={req.url} context={routerContext}>
                    <IntlProvider>
                        <HelmetProvider context={helmetContext}>
                            <App />
                        </HelmetProvider>
                    </IntlProvider>
                </Router>
            </Provider>
        </Loadable.Capture>
    );

    const bundles = getBundles(manifest, [...manifest.entrypoints, ...Array.from(modules)]);

    const styles = bundles.css || [];
    const scripts = bundles.js || [];

    const state = JSON.stringify(res.locals.store.getState());

    console.log(scripts);
    console.log(scripts.map((s: any) => res.locals.assetPath(s.file)));

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
                        //res.locals.assetPath('bundle.js'),
                        //res.locals.assetPath('vendor.js'),
                        ...scripts.map((s: any) => `/static/${s.file}`),
                    ]}
                    state={state}
                >
                    {content}
                </Html>
            )
    );
};

export default serverRenderer;
