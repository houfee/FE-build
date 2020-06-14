const path = require('path')
module.exports = {
  mode: 'development',
  entry: './src/index',
  output: {
    filename: 'build.js',
    path: path.resolve(__dirname, 'dist')
  },
  resolveLoader: {
    modules: [
      'node_modules',
      path.resolve(__dirname, 'loaders')
    ]
    // // 别名
    // alias: {
    //   loader1: path.resolve(__dirname, 'loaders', 'loader1.js')
    // }
  },
  module: { // 从右向左，从下到上
    // loader的顺序：pre>normal>inline>post
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'loader1'
        },
        enforce: 'pre'
      },
      {
        test: /\.js$/,
        use: {
          loader: 'loader2'
        }
      },
      {
        test: /\.js$/,
        use: {
          loader: 'loader3'
        },
        enforce: 'post'
      },
      // {
      //   test: /\.js$/,
      //   use: [
      //     'loader1',
      //     'loader2',
      //     'loader3'
      //   ]
      // }
    ]
  }
}
