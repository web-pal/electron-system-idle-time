const path = require('path');

module.exports = env => ({
  target: 'electron-renderer',
  entry: {
    app: [
      path.join(__dirname, 'src/renderer/index.jsx'),
    ],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.mjs', '.wasm', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: {
                    electron: '3.0.0-beta.8',
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
