const path = require('path');

const typescriptLoader = {
    entry: './src/index.ts',
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.(ts)$/,
                include: path.resolve(__dirname,'src'),
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader'
                }
            }
        ]
    },
    resolve: {
        symlinks: false,
        extensions: ['.ts', ".js"]
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    },
    optimization: {
        minimize: false // true - minimizing causes trouble with the CTabType dictionary since constructor names are also minified and the config type strings no longer match
    }
};

module.exports = typescriptLoader;
