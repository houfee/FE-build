const path = require('path')
const Webpack = require('webpack')
module.exports = {
  mode: 'development',
  // path.join(__dirname, './src/test.js'),
  entry: {
    react: ['react', 'react-dom']
  },
  output: {
    filename: '_dll_[name].js',
    path: path.join(__dirname, './build'),
    library: '_dll_[name]', // 将打包模块命名为 a
    libraryTarget: 'var', // 使用 commonjs 方式命名模块 var this commonjs
  },
  plugins: [
    new Webpack.DllPlugin({
      name: '_dll_[name]',
      path: path.resolve(__dirname, 'build', 'manifest.json')
    })
  ]
}