import webpack from 'webpack';
import rimraf from 'rimraf';
import chalk from 'chalk';
import getConfig from '../config/webpack.config.ts';
import paths from '../config/paths';
import { logMessage, compilerPromise, sleep } from './utils';

const webpackConfig = getConfig(process.env.NODE_ENV || 'development');



const build = async () => {
    rimraf.sync(paths.clientBuild);
    rimraf.sync(paths.serverBuild);

    const [clientConfig, serverConfig] = webpackConfig;
    const multiCompiler = webpack([clientConfig, serverConfig]);

    const clientCompiler = multiCompiler.compilers.find((compiler) => compiler.name === 'client');
    const serverCompiler = multiCompiler.compilers.find((compiler) => compiler.name === 'server');

    const clientPromise = compilerPromise('client', clientCompiler);
    const serverPromise = compilerPromise('server', serverCompiler);

    serverCompiler.watch({}, (error: any, stats: any) => {
        if (!error && !stats.hasErrors()) {
            console.log(stats.toString(serverConfig.stats));
            return;
        }
        console.error(chalk.red(stats.compilation.errors));
    });

    clientCompiler.watch({}, (error: any, stats: any) => {
        if (!error && !stats.hasErrors()) {
            console.log(stats.toString(clientConfig.stats));
            return;
        }
        console.error(chalk.red(stats.compilation.errors));
    });

    // wait until client and server is compiled
    try {
        await clientPromise;
        await serverPromise
        logMessage('Done!', 'info');
    } catch (error) {
        logMessage(error, 'error');
    }
};

build();
