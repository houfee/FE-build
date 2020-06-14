const path = require('path')
module.exports = {
  mode: 'development',
  entry: './src/index',
  output: {
    filename: 'build.js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'source-map',
  resolveLoader: {
    modules: ['node_modules', path.resolve(__dirname, 'loaders')]
  },
  watch: true,
  module: {
    rules: [
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.jpg$/,
        use: {
          // 目的就是根据图片生产一个md5戳，发射到dist目录下，file-loader还会返回当前的图片路径
          // url-loader 第一步， 会处理路径交给file-loader处理
          loader: 'url-loader',
          options: {
            limit: 20 * 1024
          }
        }
      },
      {
        test: /\.js$/,
        use: {
          loader: 'banner-loader',
          options: {
            text: '注释文案',
            filename: path.resolve(__dirname, 'src', 'banner.js')
          }
        }
      }
      // {
      //   test: /\.js$/,
      //   use: {
      //     loader: 'babel-loader',
      //     options: {
      //       presets: [
      //         '@babel/preset-env'
      //       ]
      //     }
      //   }
      // }
    ]
  }
}
