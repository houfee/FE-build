
/**忽略第三方包的无用配置
import moment from 'moment'
// moment.locale('zh-cn')
// 手动引入中文包
// import 'moment/locale/zh-cn'
console.log(moment().endOf('day').fromNow())
 */

/** webpack 自带的优化
  import 语法 在生产环境下回自动去除调没有使用的依赖 tree-shaking 模式
  require 语法 不支持 tree-shaking 模式
  
  scope hosting 作用域提升
  import calc from './test'
  console.log(calc.sum(10, 90))
  
  let a = 10
  let b = 20
  let c = a + b // webpack 会自动省略可以简化的代码--作用域提升
  console.log(c, '---------')
*/

/* 懒加载
let btn = document.createElement('button')

btn.innerHTML = '按钮'

btn.addEventListener('click', () => {
  console.log('click')
  // ES6 jsonp 实现动态加载js
  import('./source.js').then(data => {
    console.log(data)
  })
})

document.body.appendChild(btn)
*/

/* 热更新
import source from './source'
console.log(source)
if(module.hot) {
  module.hot.accpet('./source.js', function() {
    console.log('文件更细了')
    let source = require('./source')
    console.log(source)
  })
}
*/
