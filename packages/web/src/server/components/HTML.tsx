import * as React from 'react';

type Props = {
    children: any;
    styleElements: any;
    linkElements: any;
    helmetContext: any;
    scriptElements: any;
    state: string;
    recoilState: string;
    apolloState: string;
};

const HTML = ({
    children,
    styleElements,
    linkElements,
    scriptElements,
    state = '{}',
    recoilState = '{}',
    apolloState = '{}',
    helmetContext: { helmet },
}: Props) => (
    <html lang="">
        <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            {helmet.base.toComponent()}
            {helmet.title.toComponent()}
            {helmet.meta.toComponent()}
            {helmet.link.toComponent()}
            {helmet.script.toComponent()}
            {linkElements}
            {styleElements}
        </head>
        <body>
            {/* eslint-disable-next-line react/no-danger */}
            <div id="app" dangerouslySetInnerHTML={{ __html: children }} />
            <script
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                    // TODO: Add jsesc/stringify here
                    // see: https://twitter.com/HenrikJoreteg/status/1143953338284703744
                    __html: `window.__PRELOADED_STATE__ = ${state}`,
                }}
            />
            <script
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                    // TODO: Add jsesc/stringify here
                    // see: https://twitter.com/HenrikJoreteg/status/1143953338284703744
                    __html: `window.__PRELOADED_RECOIL_STATE__ = ${recoilState}`,
                }}
            />
            <script
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                    // TODO: Add jsesc/stringify here
                    // see: https://twitter.com/HenrikJoreteg/status/1143953338284703744
                    __html: `window.__APOLLO_STATE__ = ${apolloState}`,
                }}
            />
            {scriptElements}
        </body>
    </html>
);

export default HTML;
