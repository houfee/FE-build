// 同步保险（熔断）钩子
class SyncBailHook {
  constructor(args) { // args => ['name']
    this.tasks = []
  }
  tap(name, task) {
    this.tasks.push(task)
  }
  call(...args) {
    let ret // 当前函数的返回值
    let index = 0
    do {
      ret = this.tasks[index++](...args)
    } while(ret === undefined && index < this.tasks.length)
  }
}

let hook = new SyncBailHook(['name'])

hook.tap('node', name => {
  console.log('node', name)
  return '停止执行' // 返回值为undefined才会向下执行
})
hook.tap('vue', name => {
  console.log('vue', name)
})

hook.call('houfei')