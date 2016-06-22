var WebSocketServer = require('ws').Server,
    fs      = require('fs'),
    wss = {}

module.exports = function (server) {
  wss = new WebSocketServer({server : server})
  wss.on('connection', function (ws) {
    console.log('A ws client connected.')
    ws.on('message', function (msg) {
      msg = JSON.parse(msg)
      switch(msg.type){
        case 'json':
          fs.readFile('data/data.json', 'utf8', function (err, data) {
            if (err) throw err;
            send({type : msg.type, data : JSON.parse(data)});
          });
          break;
        case 'pdf':
          send({type : msg.type, received : msg, aaa : 'pdf'})
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