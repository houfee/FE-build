const loaderUtils = require('loader-utils')
function loader(source) {
  // 导出一个脚本
  let str = `
    let style = document.createElement('style')
    style.innerHTML= ${JSON.stringify(source)}
    document.head.appendChild(style)
  `
  return str
}
// pitch 不在执行之后的loader了
loader.pitch = function(remainingRequest) {
  // console.log(remainingRequest) // C:\Users\.....\css-loader.js!C:\Users\....\less-loader.js!C:\Users\...src\index.less
  // 让 style-loader 去处理 remainingRequest 的loader问题
  // loaderUtils.stringifyRequest 转化为相对路径
  let str = `
    let style = document.createElement('style')
    style.innerHTML= require(${loaderUtils.stringifyRequest(this, '!!' + remainingRequest)})
    console.log('111', style.innerHTML)
    document.head.appendChild(style)
  `
  return str
}
module.exports = loader
