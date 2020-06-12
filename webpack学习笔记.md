```js
// 当前学习版本
{
  "webpack": "^4.43.0",
  "webpack-cli": "^3.3.11",
  "webpack-dev-server": "^3.11.0"
}
```
## 1. webpack 常见配置

具体包含以下部分：

> entry | output | module | plugins | mode | devServer | optimization | devtool | watch

### 1.1 entry|output

可以指定一个入口或者多个入口，可以是`String` `Array` `Object`

+ `String`：打包形成一个chunk，输出一个bundle文件，输出文件名称默认是main
+ `Array`：所有入口文件最终只会形成一个chunk，输出一个bundle文件
+ `Object`：几个入口文件就有几个bundle文件，chunk名称是[key]
```js
const { resolve } = require("path")

module.exports = {
  entry: "./src/index.js", // String 单入口
  // entry: ["./src/index.js", "./src/index.js"], // Array 多入口
  // entry: { // 多入口
  //   "main": "./src/index.js",
  //   "test": "./src/index.js"
  // },
  output: { // 输出
    filename: 'js/[name].[chunkhash:10].js', // 文件夹/文件名称
    path: resolve(__dirname, 'build'), // 输出文件目录
    publicPath: '/', // 所有资源引入公共路径前缀
    chunkFilename: 'js/[name]_chunk.js', // 非入口chunk的名称
    library: '[name]', // 整个库向外暴漏的变量名
    libraryTarget: 'window' // 目标环境 global ｜ commonjs
  }
}

```

### 1.2 module

+ 主要处理非js文件

```js
const { resolve } = require("path")

module.exports = {
  module: {
    rules: [
      { // eslint
        test: /\.js$/,
        exclude: /node_modules/,
        enforce: 'pre', // previous 在mormal loader 前置执行， post
        loader: 'eslint-loader',
        options: {
          cache: true,
          fix: true // ESLint自动修复功能
        }
      },
      {
        oneOf: [ // 以下loader只会匹配一次
          {
            test: /\.js$/,
            exclude: /node_modules/,
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
                    [
                      '@babel/preset-env',
                      {
                        // 按需加载
                        useBuiltIns: 'usage',
                        corejs: {
                          version: 3 
                        },
                        targets: {
                          chrome: '58',
                          firefox: '60',
                          ie: '11',
                          safari: '10',
                          edge: '17'
                        }
                      }
                    ]
                  ],
                  cacheDirectory: true // babel 缓存
                }
              }
            ]
            
          },
          {
            test: /\.css$/,
            use: [
              MiniCssExtractPlugin.loader,
              'css-loader',
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
          {
            test: /\.less$/,
            use: [
              'style-loader',
              'css-loader',
              'less-loader'
            ]
          },
          {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            loader: "url-loader",
            options: {
              limit: 8 * 1024,
              name: '[hash:10].[ext]',
              esModule: false,
              outputPath: 'img'
            }
          },
          {
            test: /\.html$/i,
            loader: 'html-loader',
          },
          {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: 'fonts/[name].[hash:7].[ext]'
            }
          },
          {
            test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: '[name].[hash:7].[ext]',
              outputPath: 'media'
            }
          }
        ]
      }
    ]
  },
}
```

### 1.3 plugins

```js
module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: 'index.html',
      minify: {
        removeAttributeQuotes: true, // 删除双引号
        collapseWhitespace: true // 折叠空行
      },
      hash: true // 添加 hash 戳
    }),
    new MiniCssExtractPlugin({
      filename: 'css/build.[chunkhash:10].css'
    }),
    new OptimizeCssAssetsWebpackPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }],
      },
      canPrint: true
    }),
    new WorkboxWebpackPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true
    }),
    new webpack.DllReferencePlugin({
      manifest: resolve(__dirname, 'dll/manifest.json')
    }),
    // 将某个文件打包输出出去，并在html文件中引入它
    new AddAssetAtmlWebpackPlugin({
      filepath: resolve(__dirname, 'dll/jquery.js')
    })
  ],
}
```

### 1.4 mode

```js
module.export = {
  mode: "production", // development
}
```

### 1.5 devServer

```js
module.export = {
  devServer: {
    overlay: { // 如果出错了，不要全频显示
      warnings: false,
      errors: true
    },
    contentBase: resolve(__dirname, 'build'), // 运行代码的目录
    watchContentBase: true, // 监听 contentBase 目录下的文件，一旦变化就 reload
    watchOptions: { // 忽略监听文件
      ignored: /node_modules/
    },
    compress: true, // gzip压缩
    port: 8989,
    hot: true, // hmr
    open: true,
    clientLogLevel: 'none', // 不要显示启用服务器日志信息
    quiet: true, // 除去一些基本启用信息以外，其他内容都不要展示
    proxy: {
      "/api": {
        target: "https://cli.vuejs.org/config/",
        changeOrigin: true,
        pathRewrite: {
          ['^/api']: ''
        }
      }
    }
  },
}
```

### 1.6 optimization

```js
module.export = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 30 * 1024, // 分割chunk的最小为30kb
      maxChunks: 0, // 没有最大限制
      maxAsyncRequests: 5, // 按需加载时并行加载文件的最大数量
      maxInitialRequests: 3, // 入口js文件最大并行请求数量
      automaticNameDelimiter: '~', // 名称链接符
      name: true, // 可以使用命名规则
      cacheGroups: { // 分割chunk的组
        // node_modules文件会被打包到 venders组的chunk中，
        // venders-xxx.js
        // 满足上面的公共规则，如大小超过30kb，至少被引用1次
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10, // 优先级
        },
        default: {
          minChunks: 2, // 要提取的chunk最少被引用2次
          prioity: -20, // 优先级
          reuseExistingChunk: true // 如果当前要打包的模块，和之前已经被提取的模块是同一个，就会复用，而不是重新打包
        }
      },
      // 当前模块的记录其他模块的hash单独打包为一个文件 runtime
      // 解决：修改a文件导致b文件的contenthash变化
      runtimeChunk: {
        name: entrypoint => `runtime-${entrypoint.name}`
      },
      minimizer: {
        new TerserWebpackPlugin({
          cache: true, // 是否缓存
          parallel: true, // 并发打包
          sourceMap: true // 启用sourceMap
        }),
        new OptimizeCSSAssetsPlugin({
          cssProcessorPluginOptions: {
            preset: ['default', { discardComments: { removeAll: true } }],
          },
          cssProcessorOptions: {
            safe: true
          }
        })
      }

    }
  }
}
```

### 1.7 resolve

```js
module.export = {
  resolve: { // 解析第三方模块
    modules: [path.resolve('node_modules')], // 告诉webpack去哪里解析模块
    extensions: ['.js', '.json', '.jsx'], // 配置省略文件路径的后缀名
    mainFields: ['style', 'main'], // 先找 package.json 中的 style 字段，在找 main 字段
    alias: { // 别名
      bootstrap: 'bootstrap/dist/css/bootstrap.css'
    }
  },
}
```

### 1.8 devtool

```js
module.export = {
  /** devtool 配置项
  1） source-map 源码映射，生成单独的加映射文件，调试源代码，会标记出错的列和行
  2） eval-source-map 不会生成单独的文件，会标记出错的列和行
  3） 'cheap-module-source-map' 不会产生列，但是是一个单独的映射文件
  4） 'cheap-module-eval-source-map' 不会产生文件，集成在打包后的文件中，而且不会产生列 
  */
  devtool: 'source-map',
}
```



### 1.9 watch

```js
module.export = {
  /** 监控代码变换，实时打包  */
  watch: true,
  watchOptions: { // 监控选项
    poll: 1000, // 每秒 1000 检测
    aggregateTimeout: 500,// 防抖
    ignored: /node_modules/
  },
}
```



## 2.常用插件

### 2.1 配置脚本

```json
{
  "scripts": {
    "dev": "webpack-dev-server --config webpack.config.js --colors",
    "build": "webpack --config webpack.config.js --colors"
  }
}
```



### 2.2 插件介绍

+ `webpack-dev-server`
+ `html-webpack-plugin`
+ `css-loader less less-loader mini-css-extract-plugin postcss-loader style-loader url-loader` —— css相关插件
+ `optimize-css-assets-webpack-plugin`——
+ `terser-webpack-plugin`
+ `@babel/preset-env @babel/plugin-proposal-decorators @babel/plugin-proposal-class-properties @babel/plugin-transform-runtime `
+ `eslint eslint-loader`








