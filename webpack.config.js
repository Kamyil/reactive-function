const path = require('path');
const webpack = require('webpack');
const WebpackBar = require('webpackbar');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const { ESBuildPlugin } = require('esbuild-loader');

module.exports = () => {
  return {
    mode: 'production',
    target: 'node',
    entry: './src/reactive-function.ts',
    stats: 'minimal',
    node: {
      global: true,
      __filename: true,
      __dirname: true,
    },
    plugins: [
      new ESBuildPlugin(),
      new WebpackBar({
        name: 'Building...',
      }),
      new FriendlyErrorsWebpackPlugin({
        clearConsole: true,
      }),
    ],
    resolve: {
      extensions: ['.ts', '.js'],
    },
    output: {
      filename: 'reactive-function.js',
    },
    module: {
      rules: [
        {
          test: /\.ts?$/,
          loader: 'esbuild-loader',
          options: {
            loader: 'ts',
            target: 'esnext',
          },
        },
      ],
    },
  };
};
