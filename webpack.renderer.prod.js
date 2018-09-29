const path = require('path');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const config = require('./webpack.renderer.base');


module.exports = env => merge(config(env), {
  mode: 'production',
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'app/dist'),
    publicPath: './',
    filename: '[name].prod.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'app/renderer/index.tpl.html',
      inject: 'body',
      filename: 'index.html',
      excludeChunks: ['preload', 'idleTime'],
    }),
    new HtmlWebpackPlugin({
      template: 'app/renderer/idleTime.tpl.html',
      inject: 'body',
      filename: 'idleTime.html',
      chunks: ['idleTime'],
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
    }),
  ],
});
