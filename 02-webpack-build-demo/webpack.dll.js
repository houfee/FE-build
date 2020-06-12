const { resolve } = require('path')
const webpack = require('webpack')
module.exports = {
  entry: {
    vue: ['vue']
  },
  output: {
    filename: '[name].js',
    path: resolve(__dirname, 'dll'),
    library: '[name]_[hash:10]'
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]_[hash:10]',
      path: resolve(__dirname, 'dll/manifest.json')
    })
  ],
  mode: "production"
}