// 将2个 tap 产生关系
const { SyncWaterfallHook } = require('tapable')

class Lesson {
  constructor() {
    this.hooks = {
      arch: new SyncWaterfallHook(['name'])
    }
  }
  tap() { // 注册监听函数
    this.hooks.arch.tap('node', name => {
      console.log('node', name)
      return 'node 学会了'
    })
    this.hooks.arch.tap('vue', data => {
      console.log('vue', data)
    })
  }
  start() {
    this.hooks.arch.call('houfei')
  }
}

let lesson = new Lesson()
lesson.tap() // 注册2个事件
lesson.start() // 启动钩子