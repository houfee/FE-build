// 同步保险（熔断）钩子
class SyncWaterfallHook {
  constructor(args) { // args => ['name']
    this.tasks = []
  }
  tap(name, task) {
    this.tasks.push(task)
  }
  call(...args) {
    let [first, ...other] = this.tasks
    let ret = first(...args)
    other.reduce((a,b) => {
      return b(a)
    }, ret)
  }
}

let hook = new SyncWaterfallHook(['name'])

hook.tap('node', name => {
  console.log('node', name)
  return 'node Ok'
})
hook.tap('vue', data => {
  console.log('vue', data)
  return 'vue Ok'
})
hook.tap('webpack', data => {
  console.log('webpack', data)
})
hook.call('houfei')