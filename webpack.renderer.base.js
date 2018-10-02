const path = require('path');

module.exports = env => ({
  target: 'electron-renderer',
  entry: {
    app: [
      path.join(__dirname, 'app/renderer/index.jsx'),
    ],
    preload: [
      path.join(__dirname, 'app/renderer/preload.js'),
    ],
    idleTime: [
      path.join(__dirname, 'app/renderer/idleTime.jsx'),
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.mjs', '.wasm', '.json'],
    alias: {
      'renderer-components': path.resolve(__dirname, 'app/renderer/components'),
      'renderer-containers': path.resolve(__dirname, 'app/renderer/containers'),
      'renderer-reducers': path.resolve(__dirname, 'app/renderer/reducers'),
      'renderer-actions': path.resolve(__dirname, 'app/renderer/actions'),
      'renderer-selectors': path.resolve(__dirname, 'app/renderer/selectors'),
      'renderer-utils': path.resolve(__dirname, 'app/renderer/utils'),
      shared: path.resolve(__dirname, 'app/shared'),
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            cacheDirectory: false,
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: {
                    electron: '3.0.2',
                  },
                  modules: false,
                  useBuiltIns: 'entry',
                },
              ],
              [
                '@babel/preset-react',
                {
                  development: (!env || !env.NODE_ENV)
                    ? 'development'
                    : env.NODE_ENV.toLowerCase() === 'development',
                },
              ],
              '@babel/preset-flow',
            ],
            plugins: [
              '@babel/plugin-proposal-export-namespace-from',
              '@babel/plugin-proposal-export-default-from',
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-proposal-optional-chaining',
              '@babel/plugin-proposal-do-expressions',
              [
                // used only for babel helpers
                '@babel/plugin-transform-runtime',
                {
                  // regenerator runtime should be used from global polyfill
                  regenerator: false,
                  // define babel helpers as es modules
                  useESModules: true,
                },
              ],
              [
                'babel-plugin-styled-components',
                {
                  displayName: true,
                },
              ],
              [
                'import',
                {
                  libraryName: 'antd',
                  libraryDirectory: 'es',
                  style: true,
                },
              ],
            ],
            env: {
              development: {
                plugins: [
                  'react-hot-loader/babel',
                ],
              },
            },
          },
        },
      },
      {
        test: /\.(css)$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.(less)$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true,
            },
          },
        ],
      },
      // WOFF/WOFF2 Fonts
      {
        test: /\.woff(.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/font-woff',
          },
        },
      },
      // TTF Fonts
      {
        test: /\.ttf(.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/octet-stream',
          },
        },
      },
      // SVG
      {
        test: /\.svg(.*)?$/,
        use: {
          loader: 'svg-inline-loader',
        },
      },
      // Common Image Formats
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|eot|webp)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
            },
          },
        ],
      },
    ],
  },
});
