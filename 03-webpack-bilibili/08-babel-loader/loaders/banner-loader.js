const loaderUtils = require('loader-utils')
const validateOptions = require('schema-utils')
const fs = require('fs')
function loader(source) {
  this.cacheable && this.cacheable()
  // this.cacheable(false) // webpack 打包自动添加缓存， false则不添加缓存 当有大量计算时，webpack建议添加缓存
  // this
  let options = loaderUtils.getOptions(this)
  let cb = this.async()
  let schema = {
    type: 'object',
    properties: {
      text: {
        type: 'string'
      },
      filename: {
        type: 'string'
      }
    }
  }
  validateOptions(schema, options, 'banner-loader')
  if(options.filename) {
    this.addDependency(options.filename) // 自动添加文件依赖
    fs.readFile(options.filename, 'utf8', (err,data) => {
      cb(err,`/**${data}*/${source}`)
    })
  } else {
    cb(null,`/**${options.text}*/${source}`)
  }
}

module.exports = loader
