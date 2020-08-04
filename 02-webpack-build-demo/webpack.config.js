const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin') 
const TerserJSPlugin = require('terser-webpack-plugin')
const Webpack = require('webpack')

const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const WorkboxWebpackPlugin = require('workbox-webpack-plugin')
const AddAssetAtmlWebpackPlugin = require('add-asset-html-webpack-plugin')
const webpack = require('webpack')

require("core-js-pure/stable")
require("regenerator-runtime/runtime")

function resolve(dir) {
  return path.join(__dirname, './', dir)
}

module.exports = {
  mode: 'development', // development production
  entry: path.join(__dirname, './src/index.js'),
  output: {
    filename: path.posix.join('static', 'js/[name].[hash:10].js'),
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
    hot: true,
    port: 8088,
    progress: false,
    contentBase: path.join(__dirname, './build'),
    compress: true
  },
  optimization: { // 优化项
    splitChunks: {
      chunks: 'all', // 匹配的块的类型：initial（初始块），async（按需加载的异步块），all（所有块）
      minSize: 30000, // 分离后的最小块文件大小，单位为字节
      minChunks: 1, // 分离前，该块被引入的次数（也就是某个js文件通过import或require引入的次数
      maxInitialRequests: 3, //一个入口文件可以并行加载的最大文件数量
      maxAsyncRequests: 5, // 内层文件（第二层）按需加载时最大的并行加载数量
      automaticNameDelimiter: '~', // 修改上文中的 “~” ,  若改为： “-” 则分离后的js默认命名规则为 [来源]-[入口的key值].js
      name: true,
      cacheGroups: { // 缓存组
        common: { // 公共的模块
          chunks: 'initial',
          minSize: 0,
          minChunks: 2
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/, // 用于规定缓存组匹配的文件位置，test: /node_modules/  即为匹配相应文件夹下的模块
          priority: -10 // 分离规则的优先级，优先级越高，则优先匹配。
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    },
    runtimeChunk: {
      name: enyrtpoint => `runtime-${enyrtpoint.name}`
    },
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
    noParse: /jquery/, // 不去解析 jquery 中的依赖库
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
      {
        oneOf: [ // 以下loader只会匹配一次
          { // html 页面加载图片
            test: /\.html$/,
            use: 'html-withimg-loader'
          },
          { // js
            test: /\.js$/,
            include: [resolve('src')],//需要处理的文件夹
            use: [
              {
                loader: 'thread-loader',
                options: {
                  workers: 2
                }
              },
              {
                loader: 'babel-loader',
                options: {
                  presets: [
                    ["@babel/preset-env", {
                      "useBuiltIns": "entry", // 按需加载
                      "corejs": {
                        version: 3 
                      },
                      "targets": {
                        chrome: '58',
                        firefox: '60',
                        ie: '11',
                        safari: '10',
                        edge: '17'
                      }
                    }]
                  ],
                  cacheDirectory: true, // babel 缓存，在第二次构建时会读取缓存
                  plugins: [
                    ['@babel/plugin-proposal-decorators', {'legacy': true}],
                    ['@babel/plugin-proposal-class-properties', {'loose': true}],
                    "@babel/plugin-transform-runtime"
                  ]
                }
              }
            ],
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
              },
              {
                loader: 'postcss-loader',
                options: {
                  ident: 'postcss',
                  plugins: () => [
                    require('postcss-preset-env')()
                  ]
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
              {
                loader: 'postcss-loader',
                options: {
                  ident: 'postcss',
                  plugins: () => [
                    require('postcss-preset-env')()
                  ]
                }
              }
            ]
          },
          { // (png|jpe?g|gif|svg)(\?.*)
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            use: {
              loader: 'url-loader',
              options: {
                // name:  path.posix.join('static', 'img/[name].[hash:7].[ext]'),
                outputPath: 'static/img',
                name: '[name].[hash:10].[ext]',
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
              name: '[name].[hash:10].[ext]',
              outputPath: 'static/fonts',
              limit: 10000,
            }
          }
        ]
      },
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
      filename: path.posix.join('static', 'css/[name].[contenthash:10].css'),
      // disable: false,  //是否禁用此插件
      // allChunks: true,
      // publicPath: 'css',
      options: {
        insert: 'head'
      }
    }),
    new WorkboxWebpackPlugin.GenerateSW({ // 生成一个 serviceWorker 文件，需要在入口文件做配置
      clientsClaim: true, // 帮助serviceWorker快速启动
      skipWaiting: true // 删除旧的 serviceWorker
    }),
    new Webpack.DefinePlugin({ // 新增定义环境变量
      FLAG: JSON.stringify('flag') // 可以在 js 文件中直接引用
    }),
    new Webpack.ProvidePlugin({ // 通过Webpack自带方法，为每个模块注入 $ vue 对象
      $: "jquery",
      vue: "vue"
    }),
    new Webpack.BannerPlugin(`版权所有，翻版必究`), // 为构建代码打入注释
    new webpack.DllReferencePlugin({ // 告诉 webpack 那些库不参与打包，同时使用时的名称也得变
      manifest: path.resolve(__dirname, 'dll/manifest.json')
    }),
    // 将某个文件打包输出出去，并在html文件中引入它
    new AddAssetAtmlWebpackPlugin({
      filepath: path.resolve(__dirname, 'dll/vue.js')
    }),
    new CleanWebpackPlugin(), // 重新打包时，清除打包目录
    new CopyWebpackPlugin([ // copy项目相关的说明文件
      { from: 'README.md', to: './README.md', }
    ]),
    new webpack.IgnorePlugin(/\.\/locale/, /moment/), // 忽略 moment（npm 包）的locale文件，减下打包体积
    new Webpack.NamedModulesPlugin(), // 打印热更新插件路径
    new Webpack.HotModuleReplacementPlugin() // 热更新插件
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
