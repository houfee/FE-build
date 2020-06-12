const loaderUtils = require('loader-utils')
const mime = require('mime')
function loader(source) { // this
  let {limit} = loaderUtils.getOptions(this)
  if(limit && limit > source.length) {
    return `module.exports = "data:${mime.getType(this.resourcePath)};base64,${source.toString('base64')}"`
  } else {
    console.log(111)
    return require('./file-loader.js').call(this, source)
  }
}
loader.raw = true
module.exports = loader
