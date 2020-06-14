class AsyncPlugin {
  apply(compiler) {
    console.log(2)
    compiler.hooks.emit.tapAsync('AsyncPlugin', (compliation, cb) => {
      setTimeout(() => {
        console.log('文件发射完成 等1s')
        cb()
      }, 1000)
    })
    compiler.hooks.emit.tapPromise('AsyncPlugin', (compliation) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('文件发射完成 在等1s')
          resolve()
        }, 1000)
      }) 
    })
  }
}

module.exports = AsyncPlugin