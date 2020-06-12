function loader(source) {
  console.log('loader3')
  // loader 的参数就是源代码
  return source
}

module.exports = loader
