import webpack from 'webpack';
import WriteFileWebpackPlugin from 'write-file-webpack-plugin';
import baseConfig from './client.base';
const generateSourceMap = process.env.OMIT_SOURCEMAP === 'true' ? false : true;

const config = {
    ...baseConfig,
    plugins: [
        new WriteFileWebpackPlugin(),
        ...baseConfig.plugins,
        new webpack.HotModuleReplacementPlugin(),
    ],
    mode: 'development',
    devtool: generateSourceMap ? 'cheap-module-inline-source-map' : false,
    performance: {
        hints: false,
    },
};

export default config;
