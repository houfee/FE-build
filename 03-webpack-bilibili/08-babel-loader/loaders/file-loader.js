const loaderUtils = require('loader-utils')

function loader(source) { // this
  console.log(source)
  // flie-loader 需要返回一个路径
  let filename = loaderUtils.interpolateName(this, '[hash].[ext]', {
    content: source
  })
  this.emitFile(filename, source) // 发射文件
  return `module.exports="${filename}"`
}

loader.raw = true
module.exports = loader