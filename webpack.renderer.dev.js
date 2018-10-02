const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const { spawn } = require('child_process');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = require('./webpack.renderer.base');


module.exports = env => merge(config(env), {
  mode: 'development',
  devtool: 'eval-source-map',
  output: {
    path: path.resolve(__dirname, 'app/dist'),
    publicPath: '/',
    filename: '[name].js',
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
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],

  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    port: 3000,
    hot: true,
    lazy: false,
    compress: true,
    stats: 'minimal',
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    watchOptions: {
      aggregateTimeout: 1000,
      ignored: /node_modules/,
      poll: 100,
    },
    historyApiFallback: {
      verbose: true,
      disableDotRule: true,
    },
    before() {
      spawn(
        'npm',
        ['run', 'start-main-dev'],
        {
          shell: true,
          env: {
            ...process.env,
            ...env,
            ELECTRON_ENABLE_LOGGING: 'true',
            ELECTRON_DISABLE_SECURITY_WARNINGS: 'true',
          },
          stdio: 'inherit',
        },
      )
        .on('close', code => process.exit(code))
        .on('error', spawnError => console.error(spawnError));
    },
  },
});
