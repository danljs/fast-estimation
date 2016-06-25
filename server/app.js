'use strict'
let http        = require('http'),
    fs            = require('fs'),
    path          = require('path'),
    // contentTypes  = require('./utils/content-types'),
    // sysInfo       = require('./utils/sys-info'),
    env           = process.env,
    wss           = require('./src/ws_server')

let server = http.createServer((req, res) => {
  let url = req.url;
  switch(url){
    case '/health':
      res.writeHead(200);
      res.end();
      break;
    case '/info/gen':
    case '/info/poll':
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'no-cache, no-store');
      // res.end(JSON.stringify(sysInfo[url.slice(6)]()));
      break;
    case '/':
      url = 'index.html'
    default:
      fs.readFile(url, (err, data) => {
        if (err) {
          res.writeHead(404);
          res.end('Not found');
        } else {
          let ext = path.extname(url).slice(1);
          // res.setHeader('Content-Type', contentTypes[ext]);
          if (ext === 'html') {
            res.setHeader('Cache-Control', 'no-cache, no-store');
          }
          res.end(data);
        }
      });
  }
});

wss(server)

server.listen(env.NODE_PORT || 8000, env.NODE_IP || 'localhost', () => {
  console.log(`Application worker ${process.pid} started...`);
});
