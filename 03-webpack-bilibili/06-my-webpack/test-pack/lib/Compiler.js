const path = require('path')
const fs = require('fs')
// babelon 主要是把源码解析成 AST语法树
// @babel/traverse 遍历节点
// @babel/types 替换遍历的节点
// @babel/generator 生成节点
const babylon = require('babylon')
const traverse = require('@babel/traverse').default
const t = require('@babel/types')
const generator = require('@babel/generator').default
const ejs = require('ejs')
const { SyncHook} = require('tapable')
class Compiler {
  constructor(config) {
    // entry output
    this.config = config
    // 需要保存入口文件的路径
    this.entryId // 例如 './src/index.js'
    // 需要保存所有变量的依赖
    this.modules = {} // 存放所有依赖关系
    this.entry = config.entry // 入口路径
    this.root = process.cwd() // 工作路径
    this.hooks = {
      entryOption: new SyncHook(),
      compile: new SyncHook(),
      afterCompile: new SyncHook(),
      afterPlugins: new SyncHook(),
      run: new SyncHook(),
      emit: new SyncHook(),
      done: new SyncHook()
    }
    // 如果传递了plugins 参数
    let plugins = this.config.plugins
    if(Array.isArray(plugins)) {
      plugins.forEach(plugin => {
        plugin.apply(this)
      })
    }
    this.hooks.afterPlugins.call()
  }
  getSource(modulePath) { // .less
    let rules = this.config.module.rules
    let content = fs.readFileSync(modulePath, 'utf8')
    // 拿到每一个规则来处理不同类型的文件
    for(let i = 0; i < rules.length; i++) {
      let rule = rules[i]
      let { test, use} = rule
      let len = use.length -1
      if(test.test(modulePath)) {
        // 这个模块需要通过loader来解析
        function normalLoader() {
          let loader = require(use[len--])
          // loader 获取对应的 loader 函数
          content = loader(content)
          if(len >= 0) {
            normalLoader()
          }
        }
        normalLoader()
      }
    }
    return content
  }
  parse(source, parentPath) {
    // AST解析语法树
    let ast = babylon.parse(source)
    let dependencies = [] // 依赖的数组
    traverse(ast, {
      CallExpression(p) {
        // 调用表达式 a()执行，require() 执行
        let node = p.node
        if (node.callee.name === 'require') {
          node.callee.name = '__webpack_require__'
          let moduleName = node.arguments[0].value // 取到就是模块的引用名字
          moduleName = moduleName + path.extname(moduleName ? '' : '.js')
          moduleName = './' + path.join(parentPath, moduleName)
          dependencies.push(moduleName)
          node.arguments = [t.stringLiteral(moduleName)]
        }
      }
    })
    let sourceCode = generator(ast).code
    return {sourceCode, dependencies}
  }
  // 构建模块
  buildModule(modulePath, isEntry) {
    // 拿的当前模块内容
    let source = this.getSource(modulePath)
    // 拿的模块的id
    let moduleName = './' + path.relative(this.root, modulePath)
    if (isEntry) {
      this.entryId = moduleName // 保存入口名字
    }
    // 解析源碼  source源码改造，返回一个依赖列表
    let { sourceCode, dependencies } = this.parse( source, path.dirname(moduleName) )
    // 把相对路径和模块中的内容对应起来
    this.modules[moduleName] = sourceCode
    // 把所有的依赖项递归
    dependencies.forEach(dep => { // 附模块加载 递归加载
      this.buildModule(path.relative(this.root, dep), false)
    })
  }
  emitFile() {
    // 用数据渲染
    // 拿到输的到哪个目录下 输入路径
    let main = path.join(this.config.output.path, this.config.output.filename)
    // 模板路径
    let templateStr = this.getSource(path.join(__dirname, 'main.ejs'))
    let code = ejs.render(templateStr, {entryId: this.entryId, modules: this.modules})
    this.assets = {}
    // 资源中 路径对应的代码
    this.assets[main] = code
    fs.writeFileSync(main, this.assets[main])
  }
  run() {
    this.hooks.run.call()
    // 使用插件
    this.hooks.compile.call()
    // 执行解析当前依赖，把依赖变成 \webpack-dev\dist\my-main.js 的样子
    // 执行并创建模块的依赖关系
    // 绝对路径 是否是主模块
    this.buildModule(path.resolve(this.root, this.entry), true)
    this.hooks.afterCompile.call()
    // 发射一个打包后的文件
    this.emitFile()
    this.hooks.emit.call()
    this.hooks.done.call()
  }
}

module.exports = Compiler
