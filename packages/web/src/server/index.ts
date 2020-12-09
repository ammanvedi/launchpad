// import * as React from 'react';
import path from 'path';
import express from 'express';
import cors from 'cors';
import chalk from 'chalk';
import manifestHelpers from 'express-manifest-helpers';
import bodyParser from 'body-parser';
import { preloadAll } from 'react-loadable';
import paths from '../../config/paths';
// import { configureStore } from '../shared/store';
import errorHandler from './middleware/errorHandler';
import serverRenderer from './middleware/serverRenderer';
import addStore from './middleware/addStore';
import webhookVerification from './middleware/webhookVerification';
import { i18nextXhr, refreshTranslations } from './middleware/i18n';
import {keepTokensFresh} from "auth/helpers";

require('dotenv').config();

const app = express();

app.use(paths.publicPath, express.static(path.join(paths.clientBuild, paths.publicPath)));

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/favicon.ico', (_req, res) => {
    res.status(204);
    res.end()
});

app.get('/locales/refresh', webhookVerification, refreshTranslations);

// It's probably a good idea to serve these static assets with Nginx or Apache as well:
app.get('/locales/:locale/:ns.json', i18nextXhr);

app.use(addStore);

const manifestPath = path.join(paths.clientBuild, paths.publicPath);

app.use(
    manifestHelpers({
        manifestPath: `${manifestPath}/manifest.json`,
    })
);

app.use(keepTokensFresh);
app.use(serverRenderer());
app.use(errorHandler);

preloadAll()
    .then(() => {
        app.listen(process.env.PORT || 8500, () => {
            console.log(
                `[${new Date().toISOString()}]`,
                chalk.blue(`App is running: http://localhost:${process.env.PORT || 8500}`)
            );
        });
    })
    .catch((err) => {
        console.log(err);
    });

export default app;
