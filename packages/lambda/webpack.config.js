const path = require('path');
const ZipPlugin = require('zip-webpack-plugin');

const entry = {
    "custom-message": "./src/custom-message.ts",
    "custom-message-a": "./src/custom-message-a.ts"
}

const zipPlugins = Object.keys(entry).map((entryName) => {
    return new ZipPlugin({
        filename: entryName,
    })
})

module.exports = {
    devtool: "inline-source-map",
    entry,
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        ...zipPlugins
    ],
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
    },
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        libraryTarget: 'umd'
    }
};

