const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserJSPlugin = require('terser-webpack-plugin')
const Webpack = require('webpack')
const Happypack = require('happypack')
module.exports = {
  mode: 'production', // development production
  devServer: {
    port: 8088,
    open:true,
    contentBase: './build'
  },
  optimization: {
    minimizer: [
      new TerserJSPlugin({
        // cache: true,
        // parallel: true,
        // sourceMap: true
      }),
      new OptimizeCSSAssetsPlugin()
    ]
  },
  entry: path.join(__dirname, './src/index.js'),
  output: {
    filename: 'bundle.[hash:8].js',
    path: path.join(__dirname, './build')
  },
  resolve: {
    // 解析 第三方 common
    modules: [path.resolve('node_modules')],
    extensions: ['.js', '.css', '.josn'],
    // mainFields: ['style', 'main'], // packahe.json中 先找 style 再找 mian
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  plugins: [
    new Webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname, 'build', 'manifest.json')
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      minify: {
        removeAttributeQuotes: true,
        collapseWhitespace: true
      },
      hash: true
    }),
    // new Happypack({
    //   id: 'js',
    //   use: [{
    //     loader: 'babel-loader',
    //     options: {
    //       presets: ['@babel/preset-env', '@babel/preset-react'],
    //       plugins: [
    //         ['@babel/plugin-proposal-decorators', { legacy: true }],
    //         ['@babel/plugin-proposal-class-properties', { loose: true }],
    //         '@babel/plugin-transform-runtime'
    //       ]
    //     }
    //   }]
    // })
  ],
  module: {
    rules: [
      {
        test: /\.html$/,
        use: 'html-withimg-loader'
      },
      {
        test: /\.js$/,
        // use: 'Happypack/loader?id=js', // js开启多线程打包
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: [
              ['@babel/plugin-proposal-decorators', { legacy: true }],
              ['@babel/plugin-proposal-class-properties', { loose: true }],
              '@babel/plugin-transform-runtime'
            ]
          }
        },
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/
      }
    ]
  }
}
