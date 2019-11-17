module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'plugin:promise/recommended',
    'standard',
    'plugin:prettier/recommended',
  ],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true,
    },
    sourceType: 'module',
  },
  plugins: ['prettier', 'promise'],
  rules: {
    'promise/no-nesting': ['off'],
    'linebreak-style': ['error', 'unix'],
    curly: 'error',
  },
}
