// 把html页面外联的标签变成内联的标签
const HtmlWebpackPlugin = require('html-webpack-plugin')
class InlineSourcePlugin {
  constructor({match}) {
    this.match = match // 正则
  }
  // 处理每一个标签的数据
  processTag(tag, compilation) {
    console.log(tag)
    let newTag,url
    if(tag.tagName === 'link' && this,this.match.test(tag.attributes.href)) {
      newTag = {
        tagName: 'style',
        attributes: {
          type: 'text/css'
        }
      }
      url = tag.attributes.href
    }
    if(tag.tagName === 'script' && this,this.match.test(tag.attributes.src)) {
      newTag = {
        tagName: 'script',
        attributes: {
          type: 'application/javascript'
        }
      }
      url = tag.attributes.src
    }
    if(url) {
      // 将文件内容放在innerHTML属性上
      newTag.innerHTML = compilation.assets[url].source()
      delete compilation.assets[url] // 删除掉原有资源
      return newTag
    }
    return tag
  }
  // 处理引入标签的数据
  processTags(data, compilation) {
    let headTags = []
    let bodyTags = []
    data.headTags.forEach(headTag => {
      headTags.push(this.processTag(headTag, compilation))
    });
    data.bodyTags.forEach(bodyTag => {
      bodyTags.push(this.processTag(bodyTag, compilation))
    })
    return {...data, headTags, bodyTags}
  }
  apply(compiler) {
    // 通过webpackPlugin实现这个功能
    compiler.hooks.compilation.tap('InlineSourcePlugin', compilation => {
      console.log(HtmlWebpackPlugin)
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tapAsync('alterPlugin', (data, cb) => {
        // console.log(data)
        data = this.processTags(data, compilation)
        cb(null, data)
      })
    })
  }
}

module.exports = InlineSourcePlugin