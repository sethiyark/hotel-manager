const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = () => {
  const mode = process.env.NODE_ENV || 'development';

  return {
    entry: path.resolve(__dirname, 'res/js/index.js'),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'index_bundle.js',
    },
    module: {
      rules: [
        { test: /\.(js)$/, use: 'babel-loader' },
        { test: /\.css$/, use: ['style-loader', 'css-loader'] },
        {
          test: /\.s[ac]ss$/i,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                outputPath: 'assets',
              },
            },
          ],
        },
        {
          test: /\.(png|jpe?g|gif)(\?v=\d+\.\d+\.\d+)?$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                outputPath: 'images',
              },
            },
          ],
        },
      ],
    },
    node: {
      fs: 'empty',
    },
    mode,
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      publicPath: 'http://localhost:8000/',
      compress: true,
      port: 8000,
      hot: true,
      historyApiFallback: true,
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: 'res/public/index.html',
      }),
    ],
  };
};
