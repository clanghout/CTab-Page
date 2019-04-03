const path = require('path');

const typescriptLoader = {
    entry: './src/index.ts',
    mode: 'production', // otherwise evals are added which are blocked for the extension
    module: {
        rules: [
            {
                test: /\.(ts)$/,
                include: path.resolve(__dirname, 'src'),
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
        minimize: false
    }
};


module.exports = typescriptLoader;
