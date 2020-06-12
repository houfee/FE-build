class FileListPlugin {
  constructor({filename}) {
    this.filename = filename
  }
  apply(compiler) {
    // 文件路径
    // 文件已经准备好了
    compiler.hooks.emit.tap('FileListPlugin', (compilcation) => {
      // console.log(compilcation.assets)
      let assets = compilcation.assets
      let content = `| 文件名    | 资源大小    |\r\n| ---- | ---- | ---- |\r\n`
      Object.entries(assets).forEach(([filename, statObj]) => {
        content += `| ${filename}    | ${statObj.size()/1024}kb    |\r\n`
      })
      assets[this.filename] = {
        source() {
          return content
        },
        size() {
          return content.length
        }
      }
    })
  }
}

module.exports = FileListPlugin