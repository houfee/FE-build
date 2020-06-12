const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin') 
const TerserJSPlugin = require('terser-webpack-plugin')
const Webpack = require('webpack')

// 重新打包时，清除打包目录
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// copy项目相关的说明文件
const CopyWebpackPlugin = require('copy-webpack-plugin')

require("core-js-pure/stable")
require("regenerator-runtime/runtime")

function resolve(dir) {
  return path.join(__dirname, './', dir)
}

module.exports = {
  mode: 'development', // development production
  entry: path.join(__dirname, './src/index.js'),
  output: {
    filename: 'static/js/bundle.js',
    path: path.join(__dirname, './build')
  },
  devServer: {
    proxy: { // 配置代理
      '/api': { // '/api': 匹配项
        target: 'http://localhost:4000',// 接口的域名
        secure: false, // 如果是https接口，需要配置这个参数
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
        pathRewrite: {
          '^/api': ''// 如果接口本身没有/api需要通过pathRewrite来重写了地址
        }
      }
    },
    port: 8088,
    progress: false,
    contentBase: path.join(__dirname, './build'),
    compress: true
  },
  optimization: { // 优化项
    minimize: true,
    minimizer: [ // 只会在 production 生效
      new TerserJSPlugin({ // 压缩js
        cache: false, // 是否缓存
        parallel: false, // 并发打包
        sourceMap: true,
        extractComments: false // 是否将注释提取到单独的文件中
      }),
      new OptimizeCSSAssetsPlugin({ // 用于优化或者压缩CSS资源
        // assetNameRegExp: /.css$/, // 正则表达式匹配需要优化或者压缩的资源名
        // cssProcessor: 'cssnano', // 用于压缩和优化CSS的处理器, 默认 cssnano
        // cssProcessorPluginOptions: { // 传递cssProcessor的插件选项
        //   preset: ['default', { discardComments: { removeAll: true } }],
        // },
        // cssProcessorOptions: { // 传递给cssProcessor的选项 默认 {}
        //   safe: true
        // }
      })
    ]
  },
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
              ["@babel/preset-env", { // ES6 -> ES5
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
      { // css 加载第三方css
        test: /\.css$/,
        include: [/node_modules/],//需要处理的文件夹
        exclude: resolve('src'),
        use: ['style-loader','css-loader']
      },
      { // css 自己的样式配置
        test: /\.css$/,
        include: [resolve('src')],//需要处理的文件夹
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              localIdentName:'[name]-[local]-[hash:base64:6]',
              publicPath: '../../'
            }
          },
          {
            loader: 'css-loader',
            options: {
              url: true,
              modules: {
                // root: '/', //修改css中url指向的根目录, 默认值为/, 对于绝对路径, css-loader默认是不会对它进行处理的
                // modules: false, //开启css-modules模式, 默认值为flase
                // localIdentName: '[name]-[local]-[hash:base64:5]', //设置css-modules模式下local类名的命名
                // minimize: false, //压缩css代码, 默认false
                // camelCase: false, //导出以驼峰化命名的类名, 默认false
                // import: true, //禁止或启用@import, 默认true
                // url: true, //禁止或启用url, 默认true
                // sourceMap: false, //禁止或启用sourceMap, 默认false
                // importLoaders: 0, //在css-loader前应用的loader的数目, 默认为0
                // alias: {} //起别名, 默认{}
              }
            }
          }
        ]
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
            // name:  path.posix.join('static', 'img/[name].[hash:7].[ext]'),
            outputPath: 'static/img',
            name: '[name].[hash:7].[ext]',
            esModule: false,
            limit: 5 * 1024,
            // publicPath: 'http://www.houfee.top/' // 只为打包的图片添加 地址路径
          }
        }
      },
      { // /\.(woff2?|eot|ttf|otf)(\?.*)?$/
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          // name:  path.posix.join('static', 'fonts/[name].[hash:7].[ext]'),
          name: '[name].[hash:7].[ext]',
          outputPath: 'static/fonts',
          limit: 10000,
        }
      }
    ]
  },
  plugins: [
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
      // publicPath: 'css',
      options: {
        insert: 'head'
      }
    }),
    new Webpack.DefinePlugin({ // 新增定义环境变量
      FLAG: JSON.stringify('flag')
    }),
    new Webpack.ProvidePlugin({ // 通过Webpack自带方法，为每个模块注入 $ 对象
      $: "jquery"
    }),
    new Webpack.BannerPlugin(`版权所有，翻版必究`), // 为构建代码打入注释
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      { from: 'README.md', to: './README.md', }
    ])
  ],
  /** 监控代码变换，实时打包  */
  // watch: true,
  // watchOptions: { // 监控选项
  //   poll: 1000, // 每秒 1000 检测
  //   aggregateTimeout: 500,// 防抖
  //   ignored: /node_modules/
  // },
  /** devtool 配置项
  1） source-map 源码映射，生成单独的加映射文件，调试源代码，会标记出错的列和行
  2） eval-source-map 不会生成单独的文件，会标记出错的列和行
  3） 'cheap-module-source-map' 不会产生列，但是是一个单独的映射文件
  4） 'cheap-module-eval-source-map' 不会产生文件，集成在打包后的文件中，而且不会产生列 
  */
  devtool: 'source-map',
  resolve: { // 解析第三方模块
    modules: [path.resolve('node_modules')],
    extensions: ['.js', '.css', '.json'],
    mainFields: ['style', 'main'], // 先找 package.json 中的 style 字段，在找 main 字段
    alias: { // 别名
      bootstrap: 'bootstrap/dist/css/bootstrap.css'
    }
  },
  externals: { // 忽略 jQuery 打包到js中去，此时需要在html中使用cdn引入
    jquery: "jQuery",
    bootstrap: "bootstrap"
  }
}
