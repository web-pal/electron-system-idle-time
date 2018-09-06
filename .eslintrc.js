module.exports = {
  extends: [
    'airbnb',
  ],
  parser: 'babel-eslint',
  parserOptions: {
    allowImportExportEverywhere: true,
  },
  settings: {
    'import/resolver': {
      webpack: {
        env: 'development',
        config: './webpack.renderer.base.js',
      },
    },
  },
  env: {
    'shared-node-browser': true,
  },
  globals: {},
  plugins: [],
  rules: {
    'import/no-extraneous-dependencies': 'off',
    'import/prefer-default-export': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'no-console': 'off',
    'function-paren-newline': [
      'error',
      'consistent',
    ],
    'object-curly-newline': [
      'error',
      {
        ObjectExpression: {
          consistent: true,
        },
        ObjectPattern: {
          multiline: true,
        },
        ImportDeclaration: 'always',
        ExportDeclaration: 'always'
    }],
  },
};
