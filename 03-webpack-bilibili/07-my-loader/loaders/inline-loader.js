function loader(source) {
  // loader 的参数就是源代码
  console.log('inline-loader')
  return source
}

module.exports = loader
