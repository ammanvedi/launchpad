import * as React from 'react';
import * as express from 'express';
import { renderToString } from 'react-dom/server';
import { StaticRouter as Router } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from '../../shared/App';
import Html from '../components/HTML';
import Amplify from '@aws-amplify/core';
import { createApolloClient } from '../../shared/graphql/apollo';
import { ApolloProvider } from '@apollo/client';
import { getDataFromTree } from '@apollo/client/react/ssr';
import { amplifyConfig } from '../../shared/amplify';
import { RecoilRoot, Snapshot } from 'recoil';
import { ChunkExtractor } from '@loadable/server';
import { resolve } from 'path';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';
import { RecoilStateGrabber, serializeRecoilState } from 'components/recoil-ssr';
import { isLoggedInSync } from 'auth/helpers';

Amplify.configure({ ...amplifyConfig, ssr: true });

const statsFile = resolve('./build/client/static/loadable-stats.json');
const extractor = new ChunkExtractor({ statsFile, entrypoints: ['bundle'] });

const serverRenderer: any = () => async (req: express.Request, res: express.Response) => {
    const helmetContext = {};
    const getIdToken = () => Promise.resolve(res.locals.idToken);
    const apolloClient = createApolloClient(true, getIdToken);

    let recoilState: Snapshot | null = null;
    const sheet = new ServerStyleSheet();

    const checkIsLoggedIn = () => {
        return isLoggedInSync(req.headers.cookie || '');
    };

    const AppTree = (
        <StyleSheetManager sheet={sheet.instance}>
            <ApolloProvider client={apolloClient}>
                <RecoilRoot>
                    <RecoilStateGrabber onSnapshot={(s) => (recoilState = s)} />
                    <Router location={req.url}>
                        <HelmetProvider context={helmetContext}>
                            <App checkIsLoggedIn={checkIsLoggedIn} />
                        </HelmetProvider>
                    </Router>
                </RecoilRoot>
            </ApolloProvider>
        </StyleSheetManager>
    );

    const jsx = extractor.collectChunks(AppTree);

    // Fetch the data for the initial render
    await getDataFromTree(jsx);
    // Get state as a serialised string
    const apolloState = JSON.stringify(apolloClient.extract());

    // Get the initial recoil state as a string
    const serialisedRecoilState = serializeRecoilState(recoilState);

    // Scripts from @loadable
    const scriptElements = extractor.getScriptElements();
    // Links from @loadable
    const linkElements = extractor.getLinkElements();
    const styleElements = [
        // Styles from @loadable
        ...extractor.getStyleElements(),
        // Styles from styled-components
        ...sheet.getStyleElement(),
    ];

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
                    recoilState={serialisedRecoilState}
                    apolloState={apolloState}
                >
                    {content}
                </Html>,
            ),
    );
};

export default serverRenderer;
