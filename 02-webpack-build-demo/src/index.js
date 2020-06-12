console.log($)

// import 'bootstrap' // 这里引入的是别名

// 测试 css
import pic from './img/4.png'
let image = new Image()
image.src = pic
document.body.appendChild(image) 

import './less/index.less'

console.log(process.env.NODE_ENV)
console.log('DefinePlugin定义环境变量：', FLAG)

class A {
  constructor() {
    console.log('class')
  }
}

new A()