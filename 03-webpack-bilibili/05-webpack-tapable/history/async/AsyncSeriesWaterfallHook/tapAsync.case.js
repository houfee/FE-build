// 异步串行方法
class AsyncSeriesHook {
  constructor(args) {
    // args => ['name']
    this.tasks = []
  }
  tapAsync(name, task) {
    this.tasks.push(task)
  }
  callAsync(...args) {
    let finalCallBack = args.pop() // 拿出最终的函数
    let index = 0
    let next = (err, data) => {
      let task = this.tasks[index]
      if (!task) return finalCallBack()
      if (index === 0) {
        task(...args, next)
      } else {
        task(data, next)
      }
      index++
    }
    next()
  }
}

let hook = new AsyncSeriesHook(['name'])

hook.tapAsync('node', (name, cb) => {
  setTimeout(() => {
    console.log('node', name)
    cb(null, '第一个结果')
  }, 1000)
})
hook.tapAsync('vue', (data, cb) => {
  setTimeout(() => {
    console.log('vue', data)
    cb(null)
  }, 1000)
})

hook.callAsync('houfei', () => {
  console.log('模拟结束')
})
