const path = require('path');
const { CheckerPlugin } = require('awesome-typescript-loader')


const typescriptLoader = {
    entry: './src/index.ts',
    mode: 'production', // otherwise evals are added which are blocked for the extension
    module: {
        rules: [
            {
                test: /\.(ts)$/,
                include: path.resolve(__dirname, 'src'),
                exclude: /node_modules/,
                loader: 'awesome-typescript-loader'
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
    },
    plugins: [
        new CheckerPlugin()
    ]
};


module.exports = typescriptLoader;
