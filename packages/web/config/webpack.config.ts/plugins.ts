import path from 'path';
import webpack from 'webpack';
import ManifestPlugin from 'webpack-manifest-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import { TypedCssModulesPlugin } from 'typed-css-modules-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
const Dotenv = require('dotenv-webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionPlugin = require('compression-webpack-plugin');
import paths from '../paths';
import { clientOnly } from '../../scripts/utils';
import envBuilder from '../env';
import { WaitPlugin } from './wait-plugin';
import LoadablePlugin from '@loadable/webpack-plugin';

const env = envBuilder();

const isProfilerEnabled = () => process.argv.includes('--profile');

const isDev = () => process.env.NODE_ENV === 'development';
const isProd = () => process.env.NODE_ENV === 'production';
const shouldAnalyze = () => process.env.ANALYZE === 'true';

const loadableManifest = path.join(
    process.cwd(),
    'build',
    'client',
    'static',
    'loadable-stats.json',
);

export const shared = [
    new MiniCssExtractPlugin({
        filename: isDev() ? '[name].css' : '[name].[contenthash].css',
        chunkFilename: isDev() ? '[id].css' : '[id].[contenthash].css',
    }),
    new CaseSensitivePathsPlugin(),
    new Dotenv(),
];

export const client = [
    // Only use this plugin if we're not also creating a server side build
    clientOnly() &&
        new HtmlWebpackPlugin({
            filename: path.join(paths.clientBuild, 'index.html'),
            inject: true,
            template: paths.appHtml,
        }),
    // new webpack.ProgressPlugin(), // make this optional e.g. via `--progress` flag
    new webpack.DefinePlugin(env.stringified),
    new webpack.DefinePlugin({
        __SERVER__: 'false',
        __BROWSER__: 'true',
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new ManifestPlugin({ fileName: 'manifest.json' }),
    isProfilerEnabled() && new webpack.debug.ProfilingPlugin(),
    new TypedCssModulesPlugin({
        globPattern: 'src/**/*.css',
    }),
    isDev() &&
        new ReactRefreshWebpackPlugin({
            overlay: {
                sockIntegration: 'whm',
            },
        }),
    new LoadablePlugin(),
    shouldAnalyze() && new BundleAnalyzerPlugin(),
    isProd() && new CompressionPlugin(),
].filter(Boolean);

export const server = [
    new webpack.DefinePlugin({
        __SERVER__: 'true',
        __BROWSER__: 'false',
    }),
    new WaitPlugin(loadableManifest),
];

export default {
    shared,
    client,
    server,
};
