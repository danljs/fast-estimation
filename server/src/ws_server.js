var WebSocketServer = require('ws').Server,
    fs      = require('fs'),
    wss = {},
    report = require('./report')

module.exports = function (server) {
  wss = new WebSocketServer({server : server})
  wss.on('connection', function (ws) {
    console.log('A ws client connected.')
    ws.on('message', function (msg) {
      msg = JSON.parse(msg)
      console.log(msg)
      switch(msg.type){
        case 'json-request':
          fs.readFile('data/data.json', 'utf8', function (err, data) {
            if (err) throw err;
            send({type : 'json-response', data : JSON.parse(data)});
          });
          break;
        case 'print-request':
          report.create(msg.data, function (binary) {
            send({type : 'print-response', file: binary, aaa : 'pdfpdfpdf'});
          });

          // var tmp_dir = __dirname + '/tmp';
          // !!!fs.existsSync(tmp_dir) ? fs.mkdirSync(tmp_dir) : ''

          // report.create(msg.data, function (binary) {
          //   var file_name = tmp_dir + '/test.pdf'
          //   fs.writeFile(file_name, binary , function (err) {
          //     if (err) { return console.log(err)}
          //     fs.readFile(file_name,function(err1,data){
          //       if(err1){console.log(err1)}
          //       send({type : 'print-response', file: binary, aaa : 'pdfpdfpdf'});
          //     })
          //   })
          // }, function (error){res.send('ERROR:' + error)})

          break;
        default:
      }
    })
    ws.on('close', function () {console.log('A ws client disconnected.')})
    ws.on('error', function () {console.log(e)})
    var send = function (msg, cb) {
      cb = cb || function () {}
      ws.send(JSON.stringify(msg), function (err) {return ws.readyState === 3 ? cb() : cb(err)})
    }
    var broadcast = function (msg) {
      wss.clients.map(function (c) {c.send(JSON.stringify(msg))})
    }
  }
)}