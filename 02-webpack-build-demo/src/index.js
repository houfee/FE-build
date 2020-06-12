import './less/index.less'
import './test'
// import 'bootstrap' // 这里引入的是别名


// 测试 css
import pic from './img/4.png'
let image = new Image()
image.src = pic
document.body.appendChild(image) 

console.log(vue)
console.log($)
console.log(process.env.NODE_ENV)
console.log('DefinePlugin定义环境变量：', FLAG)

// 判断serviceWorker兼容性
/* 
1.eslint 不认识 window navigator 等变量
需要在package.json中配置
  "eslintConfig": {
    "extends": "airbnb-base",
    "env": {
      "browser": true // 支持浏览器端全局访问
    }
  },

2. /build 必须运行在 服务端
*/
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(() => {
        console.log('ok');
      })
      .catch(() => {
        console.log('error');
      });
  });
}
