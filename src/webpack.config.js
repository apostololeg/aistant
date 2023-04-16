import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import dotenv from 'dotenv';
import webpack from 'webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import FaviconsWebpackPlugin from 'favicons-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPartialsPlugin from 'html-webpack-partials-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';

import paths from './paths.js';

const { parsed: envs } = dotenv.config();
const pkg = require('../package.json');

export default (_env, argv) => {
  const isDev = argv.mode === 'development';
  const config = {
    entry: `${paths.src}/index.tsx`,
    output: {
      path: paths.build,
    },

    resolve: {
      modules: [paths.src, 'node_modules'],
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.styl'],
      alias: {
        theme: `${paths.src}/theme.styl`,
        uilib: '@foreverido/uilib',
      },
    },

    optimization: {
      moduleIds: 'named',
      minimize: false,
    },

    module: {
      rules: [
        {
          test: /\.m?js/,
          resolve: {
            fullySpecified: false,
          },
        },
        {
          test: /\.(j|t)sx?$/,
          // loader: 'babel-loader',
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: {
                plugins: [
                  isDev && require.resolve('react-refresh/babel'),
                ].filter(Boolean),
              },
            },
          ],
          include: [paths.src],
          // exclude: paths.modules,
        },

        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.styl$/,
          use: [
            'style-loader',
            { loader: 'css-modules-typescript-loader' },
            {
              loader: 'css-loader',
              options: {
                modules: {
                  localIdentName: '[name]__[local]___[hash:base64:5]',
                },
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  ident: 'postcss',
                  plugins: [
                    ['postcss-preset-env', { stage: 3, autoprefixer: true }],
                  ],
                },
              },
            },
            {
              loader: 'stylus-loader',
              options: {
                stylusOptions: {
                  resolveURL: true,
                },
              },
            },
          ],
        },
        {
          test: /\.svg$/,
          exclude: paths.modules,
          oneOf: [
            {
              issuer: /\.(t|j)sx?$/,
              use: [
                {
                  loader: 'babel-loader',
                },
                {
                  loader: 'react-svg-loader',
                },
              ],
            },
            {
              loader: 'file-loader',
              options: {
                name: 'static/[name].[ext]',
                outputPath: 'images/',
              },
            },
          ],
        },
        {
          test: /\.(woff|woff2|eot|ttf|png|jpg)$/,
          use: {
            loader: 'file-loader',
            options: {
              name: 'static/[name].[ext]',
              outputPath: 'images/',
            },
          },
        },
      ],
    },

    plugins: [
      new CleanWebpackPlugin({ verbose: true }),

      new webpack.ProvidePlugin({
        React: 'react',
      }),

      new webpack.DefinePlugin({
        isDEV: JSON.stringify(isDev),
        VERSION: JSON.stringify(pkg.version),
        DOMAIN: JSON.stringify(envs.DOMAIN || 'http://localhost'),
        PORT: JSON.stringify(envs.PORT || 4051),
      }),

      new CopyWebpackPlugin({
        patterns: [
          {
            from: `${paths.assets}/*.css`,
            to: `${paths.build}/[name].css`,
          },
          {
            from: `${paths.assets}/fonts`,
            to: `${paths.build}/fonts`,
          },
          {
            from: `${paths.assets}/logo.svg`,
            to: paths.build,
          },
          // {
          //   from: `${paths.assets}/images`,
          //   to: `${paths.build}/images`,
          // },
        ],
      }),

      !isDev &&
        new HtmlWebpackPartialsPlugin({
          path: `${paths.assets}/analytics.html`,
          location: 'body',
          priority: 'low',
        }),

      !isDev && new FaviconsWebpackPlugin(`${paths.assets}/logo.svg`),

      new HtmlWebpackPlugin({
        // lang: PAGE_LANG,
        // title: PAGE_TITLE,
        baseUrl: '/',
        filename: 'index.html',
        template: `${paths.assets}/index.html`,
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        },
      }),

      new MiniCssExtractPlugin({
        filename: isDev ? '[name].css' : '[name].[hash].css',
        chunkFilename: isDev ? '[id].css' : '[id].[hash].css',
      }),

      isDev && new webpack.HotModuleReplacementPlugin(),
      isDev && new ReactRefreshWebpackPlugin(),
    ].filter(Boolean),
  };

  if (isDev) {
    const proxyConfig = {
      secure: false,
      changeOrigin: true,
      logLevel: 'debug',
      target: `http://localhost:${envs.PORT}`,
    };

    Object.assign(config, {
      devtool: 'source-map',
      devServer: {
        hot: true,
        port: '3051',
        historyApiFallback: true,
        // open: true,
        devMiddleware: {
          writeToDisk: true,
        },
        proxy: {
          '/api': proxyConfig,
        },
      },
    });
  }

  return config;
};
