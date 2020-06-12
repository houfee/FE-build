const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin') // 用于优化\最小化CSS
const TerserJSPlugin = require('terser-webpack-plugin')
const Webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
require("core-js-pure/stable")
require("regenerator-runtime/runtime")

function resolve(dir) {
  return path.join(__dirname, './', dir)
}

module.exports = {
  mode: 'production', // development production
  devServer: {
    port: 8082,
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserJSPlugin({
        cache: true, // 是否缓存
        parallel: true, // 并发打包
        sourceMap: true,
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorPluginOptions: {
          preset: ['default', { discardComments: { removeAll: true } }],
        },
        cssProcessorOptions: {
          safe: true
        }
      })
    ]
  },
  entry: path.join(__dirname, './src/index.js'),
  output: {
    filename: './static/js/bundle.js',
    path: path.join(__dirname, './build')
  },
  resolve: { // 解析第三方模块
    modules: [path.resolve('node_modules')],
    extensions: ['.js', '.css', '.json'],
    mainFields: ['style', 'main'], // 先找 package.json 中的 style 字段，在找 main 字段
    // alias: { // 别名
    //   bootstrap: 'bootstrap/dist/css/bootstrap.css'
    // }
  },
  plugins: [
    new Webpack.DefinePlugin({ // 定义环境变量
      ENV: JSON.stringify('production'), // production
      FLAG: 'true',
      EXPRESSION: '5*8'
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
    new MiniCssExtractPlugin({
      filename: path.posix.join('static', 'css/[name].[contenthash].css'),
      // disable: false,  //是否禁用此插件
      // allChunks: true,
      // publicPath: '',
      options: {
        insert: 'head'
      }
    }),
    new Webpack.ProvidePlugin({ // 在每个模块注入 $ 对象
      "$": "jquery"
    }),
    // 重新打包时，清除打包目录
    // new CleanWebpackPlugin(),
    // new CopyWebpackPlugin([
    //   { from: 'doc', to: './doc', }
    // ]),
    // new Webpack.BannerPlugin('版权所有，翻版必究'),
  ],
  module: {
    rules: [
      { // eslint
        test: /\.js$/,
        enforce: 'pre', // previous 在mormal loader 前置执行， post
        use: {
          loader: 'eslint-loader',
          options: {
            cache: true,
            fix: true // ESLint自动修复功能
          }
        },
        enforce: 'pre', // previous post
        exclude: /node_modules/
      },
      { // html 页面加载图片
        test: /\.html$/,
        use: 'html-withimg-loader'
      },
      { // js
        test: /\.js$/,
        include: [resolve('src')],//需要处理的文件夹
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ["@babel/preset-env", {
                "useBuiltIns": "entry", // entry usage
                "corejs": 3,
                "targets": {
                  "chrome": "58",
                  "ie": "11"
                }
              }]
            ],
            plugins: [
              ['@babel/plugin-proposal-decorators', {'legacy': true}],
              ['@babel/plugin-proposal-class-properties', {'loose': true}],
              "@babel/plugin-transform-runtime"
            ]
          }
        },
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/
      },
      { // css - 这是加载第三方css-自己的样式写在less中
        test: /\.css$/,
        use: ['style-loader','css-loader']
      },
      { // less
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // localIdentName:'[name]-[local]-[hash:base64:6]',
              publicPath: '../../'
            }
          },
          {
            loader: 'css-loader',
            options: {}
          },
          'less-loader',
          'postcss-loader'
        ]
      },
      { // (png|jpe?g|gif|svg)(\?.*)
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            name:  path.posix.join('static', 'img/[name].[hash:7].[ext]'),
            esModule: false,
            limit: 5 * 1024,
            // outputPath: 'img/',
            // name: '[name].[hash:7].[ext]',
            // publicPath:'img/'
            // publicPath: 'http://www.houfee.top/' // 只为打包的图片添加 地址路径
          }
        }
      },
      { // /\.(woff2?|eot|ttf|otf)(\?.*)?$/
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          name:  path.posix.join('static', 'fonts/[name].[hash:7].[ext]'),
          limit: 10000,
        }
      }
    ]
  }
}
