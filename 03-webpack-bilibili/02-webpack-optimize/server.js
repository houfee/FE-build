let express = require('express')

let app = express()

app.get('/user',(req, res) => {
  res.json('server 服务')
})

app.listen(4000) // 将服务跑在 4000 端口