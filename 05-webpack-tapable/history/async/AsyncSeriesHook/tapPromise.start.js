const { AsyncSeriesHook } = require('tapable')
class Lesson {
  constructor() {
    this.hooks = {
      arch: new AsyncSeriesHook(['name'])
    }
  }
  tap() { // 注册监听函数
    this.hooks.arch.tapPromise('node', (name) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('node', name)
          resolve()
        }, 1000)
      })
    })
    this.hooks.arch.tapPromise('vue', (name) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('vue', name)
          resolve()
        }, 1000)
      })
    })
  }
  start() {
    this.hooks.arch.promise('houfei').then(() => {
      console.log('异步执行结束')
    })
  }
}

let lesson = new Lesson()
lesson.tap() // 注册2个事件
lesson.start() // 启动钩子