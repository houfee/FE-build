  const { smart } = require('webpack-merge')
  const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin') // 用于优化\最小化CSS
  const TerserJSPlugin = require('terser-webpack-plugin')

  let base = require('./webpack.base.js')
  module.exports = smart(base, {
    mode: 'production',
    optimization: {
      minimize: true,
      minimizer: [
        new TerserJSPlugin({
          cache: true, // 是否缓存
          parallel: true, // 并发打包
          sourceMap: true
        }),
        new OptimizeCSSAssetsPlugin({
          cssProcessorPluginOptions: {
            preset: ['default', { discardComments: { removeAll: true } }]
          },
          cssProcessorOptions: {
            safe: true
          }
        })
      ]
    }
  })
