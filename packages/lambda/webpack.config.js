const path = require('path');
const ZipPlugin = require('zip-webpack-plugin');

const entry = {
    'custom-message': './src/custom-message.ts',
    // 'new-function-entry': './src/new-function-entry.ts',
};

const zipPlugins = Object.keys(entry).map((entryName) => {
    return new ZipPlugin({
        filename: entryName,
        fileOptions: {
            /**
             * Here we are setting a static modified time, we dont really
             * need a proper modified time in practice and it means that the
             * hash of the output zip will only be based on if file contents have changed
             * this means that we can build the code in ci and rely on it having the same
             * hash after it has been zipped.
             */
            mtime: new Date('2020-12-20T13:47:27+0000'),
        },
    });
});

module.exports = {
    devtool: 'inline-source-map',
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
    plugins: [...zipPlugins],
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        libraryTarget: 'commonjs',
    },
};
