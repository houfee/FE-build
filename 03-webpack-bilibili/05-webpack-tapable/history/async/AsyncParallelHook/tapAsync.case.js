// 异步并行方法
class AsyncParallelHook {
  constructor(args) { // args => ['name']
    this.tasks = []
  }
  tapAsync(name, task) {
    this.tasks.push(task)
  }
  callAsync(...args) {
    let finalCallBack = args.pop() // 拿出最终的函数
    let index = 0
    let done = () => { // 原理 类似于 Promise.all()
      index++
      if(index === this.tasks.length) {
        finalCallBack()
      }
    }
    this.tasks.forEach( task => task(...args,  done))
  }
}

let hook = new AsyncParallelHook(['name'])

hook.tapAsync('node', (name, cb) => {
  setTimeout(() => {
    console.log('node', name)
    cb()
  },  1000)
})
hook.tapAsync('vue', (name, cb) => {
  setTimeout(() => {
    console.log('vue', name)
    cb()
  },  1000)
})

hook.callAsync('houfei', () => {
  console.log('模拟结束')
})