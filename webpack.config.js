const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = () => {
  return {
    entry: './res/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'index_bundle.js',
    },
    module: {
      rules: [
        { test: /\.(js)$/, use: 'babel-loader' },
        { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      ],
    },
    node: {
      fs: 'empty',
    },
    mode: 'development',
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
        template: 'res/index.html',
      }),
    ],
  };
};
