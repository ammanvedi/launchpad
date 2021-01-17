// import * as React from 'react';
import path from 'path';
import express from 'express';
import cors from 'cors';
import chalk from 'chalk';
import manifestHelpers from 'express-manifest-helpers';
import bodyParser from 'body-parser';
import paths from '../../config/paths';
import errorHandler from './middleware/error-handler';
import serverRenderer from './middleware/server-renderer';
import { keepTokensFresh } from './middleware/keep-tokens-fresh';
import staticGzip from 'express-static-gzip';
import cookieParser from 'cookie-parser';

require('dotenv').config();

const app = express();

const staticPath = path.join(paths.clientBuild, paths.publicPath);

app.use(
    paths.publicPath,
    staticGzip(staticPath, {
        enableBrotli: false,
        index: false,
        serveStatic: {
            maxAge: 31536000,
        },
    }),
);

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.get('/favicon.ico', (_req, res) => {
    res.status(204);
    res.end();
});

const manifestPath = path.join(paths.clientBuild, paths.publicPath);

app.use(
    manifestHelpers({
        manifestPath: `${manifestPath}/manifest.json`,
    }),
);

app.use(keepTokensFresh);
app.use(serverRenderer());
app.use(errorHandler);

app.listen(process.env.PORT || 8500, () => {
    console.log(
        `[${new Date().toISOString()}]`,
        chalk.blue(`App is running: http://localhost:${process.env.PORT || 8500}`),
    );
});

export default app;
