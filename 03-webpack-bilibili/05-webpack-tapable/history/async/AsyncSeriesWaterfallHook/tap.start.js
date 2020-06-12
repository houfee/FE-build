// 异步的钩子（串行）
const { AsyncSeriesWaterfallHook } = require('tapable')
class Lesson {
  constructor() {
    this.hooks = {
      arch: new AsyncSeriesWaterfallHook(['name'])
    }
  }
  tap() { // 注册监听函数
    this.hooks.arch.tapAsync('node', (name, cb) => {
      // cb 这个回调可以表示这个异步什么时候执行完
      setTimeout(() => {
        console.log('node', name)
        // cb(null, 'result')
        cb('error', 'result') // 会跳过下一个钩子，直接执行最后的 hook
      },  1000)
    })
    this.hooks.arch.tapAsync('vue', (data, cb) => {
      setTimeout(() => {
        console.log('vue', data)
        cb()
      },  1000)
    })
  }
  start() {
    this.hooks.arch.callAsync('houfei', () => {
      console.log('异步串行执行结束')
    })
  }
}

let lesson = new Lesson()
lesson.tap() // 注册2个事件
lesson.start() // 启动钩子