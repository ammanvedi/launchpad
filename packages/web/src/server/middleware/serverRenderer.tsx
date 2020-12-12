import * as React from 'react';
import * as express from 'express';
import { renderToString } from 'react-dom/server';
import { StaticRouter as Router } from 'react-router-dom';
import { Store } from 'redux';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import IntlProvider from '../../shared/i18n/IntlProvider';
import App from '../../shared/App';
import Html from '../components/HTML';
import Amplify from '@aws-amplify/core';
import {createApolloClient} from "../../shared/graphql/apollo";
import {ApolloProvider} from "@apollo/client";
import {getDataFromTree} from "@apollo/client/react/ssr";
import {amplifyConfig} from "../../shared/amplify";
import {RecoilRoot, useRecoilSnapshot, Snapshot} from "recoil";
import { ChunkExtractor } from '@loadable/server'
import {resolve} from 'path';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'

Amplify.configure({...amplifyConfig, ssr: true});

const statsFile = resolve('./build/client/static/loadable-stats.json');
const extractor = new ChunkExtractor({ statsFile, entrypoints: ['bundle'] })

const serverRenderer: any = () => async (
    req: express.Request & { store: Store },
    res: express.Response
) => {
    const helmetContext = {};
    const getIdToken = () => Promise.resolve(res.locals.idToken)
    const apolloClient = createApolloClient(true, getIdToken);
    const routerContext = {
        isLoggedIn: res.locals.isLoggedIn
    };

    let recoilState = null;

    const RecoilStateGrabber = () => {
        const snapshot = useRecoilSnapshot();
        recoilState = snapshot;
        return null
    }

    const serializeRecoilState = (snapshot: Snapshot) => {
        const nodes = snapshot.getNodes_UNSTABLE();

        const serialState = {};
        Array.from(nodes).forEach(node => {
            console.log(node)
            const loadable = snapshot.getLoadable(node);
            if(loadable.state === 'hasValue') {
                console.log(loadable.contents);
                // @ts-ignore
                serialState[node.key] = loadable.contents
            }
        })

        return JSON.stringify(serialState)
    }

    const sheet = new ServerStyleSheet()

    const AppTree = (
        <StyleSheetManager sheet={sheet.instance}>
            <ApolloProvider client={apolloClient}>
                <RecoilRoot>
                    <RecoilStateGrabber />
                    <Provider store={res.locals.store}>
                        <Router location={req.url} context={routerContext}>
                            <IntlProvider>
                                <HelmetProvider context={helmetContext}>
                                    <App/>
                                </HelmetProvider>
                            </IntlProvider>
                        </Router>
                    </Provider>
                </RecoilRoot>
            </ApolloProvider>
        </StyleSheetManager>

    );

    const jsx = extractor.collectChunks(AppTree)

    // Apollo State
    await getDataFromTree(jsx);
    const apolloState = JSON.stringify(apolloClient.extract());

    // State
    const state = JSON.stringify(res.locals.store.getState());
    const serialisedRecoilState = serializeRecoilState(recoilState as any)

    // Scripts
    const scriptElements = extractor.getScriptElements()
    const linkElements = extractor.getLinkElements()
    const styleElements = [
        ...extractor.getStyleElements(),
        ...sheet.getStyleElement()
    ]

    sheet.seal();

    const content = renderToString(jsx);

    return res.send( 
        '<!doctype html>' +
        renderToString(
            <Html
                linkElements={linkElements}
                styleElements={styleElements}
                scriptElements={scriptElements}
                helmetContext={helmetContext}
                state={state}
                recoilState={serialisedRecoilState}
                apolloState={apolloState}
            >
                {content}
            </Html>
        )
    );
};

export default serverRenderer;
