const babel = require('@babel/core')
const loaderUtils = require('loader-utils')

function loader(source) { // this
  let options = loaderUtils.getOptions(this)
  let cb = this.async()
  babel.transform(source,{
    ...options,
    sourceMaps: true,
    filename: this.resourcePath.split('/').pop(), // 文件名
  },(err, result) => {
    cb(err, result.code, result.map)
  })
}

module.exports = loader