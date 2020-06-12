console.log('holle')

//= -! 不会让文件 再去通过pre normal loader 执行
//= ! 没有nornal
//=  !! 什么都没有
let str = require('!!inline-loader!./a.js')


// loader 默认是由两部分组成，分别为 pitch 和 norma
