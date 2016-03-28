/**
 * # Build
 *
 * Configuration to create the website.
 */

import path from 'path'

const merge = require('deep-merge')((target, source, key) => {
  if (target instanceof Array) {
    return [].concat(target, source)
  }
  return source
})

import { emptyDirSync, copySync } from 'fs-extra'
import webpack from 'webpack'
import express from 'express'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'

import ExtractTextPlugin from 'extract-text-webpack-plugin'

// stylus + postcss
import autoprefixer from 'autoprefixer'
import typographic from 'typographic'
import pxtorem from 'postcss-pxtorem'
import lost from 'lost'


export default (env) => {
  return new Promise((resolve, reject) => {

    var config = {
      target: 'web',
      entry: {
        main: [
          'babel-polyfill',
          `${env.SRC}/main.js`
        ]
      },
      resolve: {
        extensions: ['', '.js', '.jsx', '.json']
      },
      output: {
        path: env.DIST,
        filename: 'bundle.js'
      },
      node: {
        fs: 'empty'
      },
      plugins: [
        new webpack.ProvidePlugin({
          fetch: 'imports?this=>global!exports?global.fetch!whatwg-fetch'
        })
      ],
      module: {
        loaders: [
          {
            test: /\.jsx?$/,
            include: env.SRC,
            loader: 'babel',
            query: {

              "env": {
                "development": {
                  "plugins": [
                    ["react-transform", {
                      "transforms": [
                        {
                          "transform": "react-transform-hmr",
                          "imports": ["react"],
                          "locals": ["module"]
                        },
                        {
                          "transform": "react-transform-catch-errors",
                          "imports": ["react", "redbox-react"]
                        }
                      ]
                    }]
                  ]
                }
              }

            }
          },
          {
            test: /\.json$/,
            loader: 'json'
          },
          {
            test: /\.(jpe?g|png|gif|svg|ico)$/i,
            loaders: [
              'file?hash=sha512&digest=hex&name=[hash].[ext]'
            ]
          }
        ]
      },
      // specific packages
      stylus: {
        use: [typographic()],
        import: ['typographic', `${env.SRC}/design/**`],
        errors: true
      },
      postcss: function(){
        return [
          lost({/** https://github.com/corysimmons/lost#global-grid-settings **/
            flexbox: 'flex'
          }),
          pxtorem({/** https://github.com/cuth/postcss-pxtorem#options **/}),
          autoprefixer({/** https://github.com/postcss/autoprefixer-core#usage **/
            // browsers: ['last 2 versions']
          })
        ]
      }
    }

    // clean + copy icon
    emptyDirSync(config.output.path)
    copySync(`${env.SRC}/static/favicon.png`, `${config.output.path}/favicon.png`)

    if (__DEVELOPMENT__) { // = development

      copySync(`${env.SRC}/static/index.dev.html`, `${config.output.path}/index.html`)

      const virtual = {
        host: 'localhost',
        port: 10000
      }

      // define package
      config = merge(config, {
        devtool: 'inline-source-map',
        debug: true,
        entry: {
          main: [
            // -> queryparams enable reload
            `webpack-hot-middleware?path=http://${virtual.host}:${virtual.port}/__webpack_hmr`
          ]
        },
        output: {
          // include port for remote reference
          publicPath: `http://${virtual.host}:${virtual.port}/`
        },
        plugins: [
          new webpack.DefinePlugin({
            __DEVELOPMENT__: true
          }),
          new webpack.HotModuleReplacementPlugin(),
          new webpack.NoErrorsPlugin()
        ],
        module: {
          loaders: [
            {
              test: /\.styl$/,
              loader: [ // loader: 'style!css!postcss!stylus'
                'style',
                'css?module&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
                'postcss',
                'stylus?outputStyle=expanded&sourceMap'
              ].join('!')
            }
            // {
            //   test: /\.css$/,
            //   loader: [
            //     'style',
            //     'css', // no CSS modules used !
            //     'postcss'
            //   ].join('!')
            // }
          ]
        }
      })

      const server = express()
      const compiler = webpack(config)
      // virtual embed !
      server.use(webpackDevMiddleware(compiler, {
        contentBase: `http://${virtual.host}:${virtual.port}`,
        noInfo: true,
        quiet: true,
        hot: true,
        inline: true,
        lazy: false,
        publicPath: config.output.publicPath,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        stats: {
          colors: true
        }
      }))
      server.use(webpackHotMiddleware(compiler))
      return server.listen(virtual.port, function (error) {
        if (error) {
          return reject(error)
        }
        console.log(`[HOTLOADER] ${config.output.publicPath}`)
        return resolve()
      })
    }

    copySync(`${env.SRC}/static/index.html`, `${config.output.path}/index.html`)

    // = production
    config = merge(config, {
      devtool: 'source-map',
      debug: false,
      plugins: [
        new webpack.DefinePlugin({
          __DEVELOPMENT__: false,
          'process.env': { // optimize builts
            NODE_ENV: JSON.stringify('production')
          }
        }),
        new ExtractTextPlugin('styles.css', { allChunks: true }),
        new webpack.PrefetchPlugin('react'),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
          sourceMap: false, // true
          compress: {
            screw_ie8: true,
            warnings: false
          }
        })
      ],
      module: {
        loaders: [
          {
            test: /\.styl$/,
            loader: ExtractTextPlugin.extract('style-loader', [
              'css?module&importLoaders=1',
              'postcss',
              'stylus'
            ].join('!')),
          }
          // {
          //   test: /\.css$/,
          //   loader: ExtractTextPlugin.extract('style-loader', [
          //     'css', // no css modules
          //     'postcss'
          //   ].join('!'))
          // }
        ]
      },
      stylus: {
        compress: true
      }
    })

    webpack(config).run(function (error, stats) { // notify
      if (error) {
        return reject(error)
      }
      console.log('[BUILD] - Client', stats.toString())
      return resolve()
    })

  })
}
