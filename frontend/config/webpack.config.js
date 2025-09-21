'use strict';

const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const paths = require('./paths');

const isEnvDevelopment = process.env.NODE_ENV !== 'production';
const isEnvProduction = !isEnvDevelopment;

const getStyleLoaders = (cssOptions, preProcessor) => {
  const loaders = [
    isEnvDevelopment && 'style-loader',
    isEnvProduction && MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: cssOptions,
    },
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          ident: 'postcss',
          plugins: ['postcss-preset-env'],
        },
        sourceMap: isEnvDevelopment,
      },
    },
  ].filter(Boolean);

  if (preProcessor) {
    loaders.push({
      loader: 'resolve-url-loader',
      options: {
        sourceMap: isEnvDevelopment,
        root: paths.appSrc,
      },
    });
    loaders.push({
      loader: preProcessor,
      options: { sourceMap: true },
    });
  }
  return loaders;
};

module.exports = {
  mode: isEnvProduction ? 'production' : 'development',
  entry: paths.appIndexJs,
  output: {
    path: paths.appBuild,
    filename: isEnvProduction
      ? 'static/js/[name].[contenthash:8].js'
      : 'static/js/bundle.js',
    publicPath: paths.publicUrlOrPath,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        include: paths.appSrc,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: getStyleLoaders({ importLoaders: 1 }),
        sideEffects: true,
      },
      {
        test: /\.(scss|sass)$/,
        use: getStyleLoaders({ importLoaders: 3 }, 'sass-loader'),
      },
      {
        test: /\.(png|jpe?g|gif|svg|bmp|avif)$/,
        type: 'asset/resource',
      },
    ],
  },
  optimization: {
    minimize: isEnvProduction,
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: paths.appHtml,
      inject: true,
    }),
    isEnvProduction && new MiniCssExtractPlugin(),
    new WebpackManifestPlugin({ publicPath: paths.publicUrlOrPath }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(
        isEnvDevelopment ? 'development' : 'production'
      ),
    }),
  ].filter(Boolean),
};
