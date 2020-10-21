var express = require('express');
var app = express();
var router = express.Router();
var Mock = require('mockjs');

// 允许跨域 /
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header("Access-Control-Allow-Origin", '*');
    // request header里自定义了token，Access-Control-Allow-Headers里需要写入token，否则无法识别
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    if(req.method=="OPTIONS") res.send(200);/*让options请求快速返回*/
    else  next();
});

router.get('/search_placeholder', function(req, res) {
  let data = Mock.mock({
    code: 200,
    message: 'success',
    'data|1-10': [{
      'id|+1': 1,
      'placeholder|2-4':'fwoefoeg'
    }]
  })
  res.json(data)
});
router.put('/search_placeholder', function(req, res) {
  let data = {
    code: 200,
    message: 'success'
  };
  return res.json(data)
});
router.post('/search_placeholder', function(req, res) {
  let data = {
    code: 200,
    message: 'success'
  };
  return res.json(data)
});
router.delete('/search_placeholder', function(req, res) {
  let data = {
    code: 200,
    message: 'success'
  };
  return res.json(data)
});

app.use('/ops', router);



let port = 8089;
app.listen(port, function () {
  console.log('Mock Server启动成功!');
}); 