function loader(source) {
  // loader 的参数就是源代码
  console.log('loader1')
  return source
}

loader.pitch = function() {
  console.log('这是loader1的pitch')
}

module.exports = loader
