#! /usr/bin/env node

// ① test-pack把项目链接到全局：npm link
// ② 在webpack-dev 执行 npm link zf-pack 404：表示链接成功
// ③ 测试： npx zf-pack

// console.log('holle----111')

// 1 需要找到当前执行命令的路径，拿到webpack.config.js
let path = require('path')

// config 配置文件
let config = require(path.resolve('webpack.config.js'))

let Compiler = require('../lib/Compiler.js')
let compiler = new Compiler(config)
compiler.hooks.entryOption.call()
// 标识运行代码编译
compiler.run()
