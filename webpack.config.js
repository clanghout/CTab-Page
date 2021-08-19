const path = require('path');
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  //plugins: [new MiniCssExtractPlugin()],
  entry: {
      source: './src/index.ts',
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: [
            "ts-loader",
          ],
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'file-loader',
                        options: { outputPath: '', name: '[name].css'}
                    },
                    'sass-loader'
                ]
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', 
    //'.scss', '.css', '.sass'
],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};