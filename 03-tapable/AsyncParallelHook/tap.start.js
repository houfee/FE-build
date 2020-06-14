// 异步并行的钩子
const { AsyncParallelHook } = require('tapable')
// 异步的钩子（串行）并行 需要等待所有并发的异步事件执行后再执行回调方法
// 注册方法 分为 tap方法 和 tapAsync 方法
class Lesson {
  constructor() {
    this.hooks = {
      arch: new AsyncParallelHook(['name'])
    }
  }
  tap() { // 注册监听函数
    this.hooks.arch.tapAsync('node', (name, cb) => {
      // cb 这个回调可以表示这个异步什么时候执行完
      setTimeout(() => {
        console.log('node', name)
        cb()
      },  1000)
    })
    this.hooks.arch.tapAsync('vue', (name, cb) => {
      setTimeout(() => {
        console.log('vue', name)
        cb()
      },  1000)
    })
  }
  start() {
    this.hooks.arch.callAsync('houfei', () => {
      console.log('异步执行结束')
    })
  }
}

let lesson = new Lesson()
lesson.tap() // 注册2个事件
lesson.start() // 启动钩子