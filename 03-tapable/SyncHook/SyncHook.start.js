const { SyncHook } = require('tapable')

class Lesson {
  constructor() {
    this.hooks = {
      arch: new SyncHook(['name'])
    }
  }
  tap() { // 注册监听函数
    this.hooks.arch.tap('node', name => {
      console.log('node', name)
    })
    this.hooks.arch.tap('vue', name => {
      console.log('vue', name)
    })
  }
  start() {
    this.hooks.arch.call('houfei')
  }
}

let lesson = new Lesson()
lesson.tap() // 注册2个事件
lesson.start() // 启动钩子