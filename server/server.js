#!/bin/env node
var http    = require('http'),
    express = require('express'),
    fs      = require('fs'),
    report = require('./src/report'),
    wss = require('./src/ws_server');

process.env.OPENSHIFT_NODEJS_PORT = 8000;

var SampleApp = function() {

    var self = this;

    self.setupVariables = function() {
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
        self.port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

        if (typeof self.ipaddress === "undefined") {
            console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
            self.ipaddress = "127.0.0.1";
        };
    };

    self.populateCache = function() {
        if (typeof self.zcache === "undefined") {
            self.zcache = { 'index.html': '' };
        }

        fs.stat('./index.html', function(err,stat){
            self.zcache['index.html'] = !!!err ?
            fs.readFileSync('./index.html') : 'Hello Fast Estimation';
        });
    };

    self.cache_get = function(key) { return self.zcache[key]; };

    self.terminator = function(sig){
        if (typeof sig === "string") {
           console.log('%s: Received %s - terminating sample app ...',
                       Date(Date.now()), sig);
           process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()) );
    };

    self.setupTerminationHandlers = function(){
        process.on('exit', function() { self.terminator(); });
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
         'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { self.terminator(element); });
        });
    };

    self.createRoutes = function() {
        self.routes = { };
        
        self.routes['/'] = function(req, res) {
            res.setHeader('Content-Type', 'text/html');
            res.send(self.cache_get('index.html') );
        };
        self.routes['/pdf'] = function(req, res) {
            var tmp_dir = __dirname + '/tmp';
            !!!fs.existsSync(tmp_dir) ? fs.mkdirSync(tmp_dir) : ''

            report.create(req.data, function (binary) {
                var file_name = tmp_dir + '/test.pdf'
                fs.writeFile(file_name, binary , function (err) {
                    if (err) { return console.log(err)}
                        res.download(file_name)
                    })
                }, function (error){res.send('ERROR:' + error)}
            )
        };
    };

    self.initializeServer = function() {
        self.createRoutes();
        self.app = express();

        self.app.use(express.static(__dirname));

        self.app.use( function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*")
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
            next()
        })
        
        for (var r in self.routes) {
            self.app.get(r, self.routes[r]);
        }
    };

    self.initialize = function() {
        self.setupVariables();
        self.populateCache();
        self.setupTerminationHandlers();
        self.initializeServer();
    };

    self.start = function() {
        var server = http.createServer(self.app);
        wss(server);
        server.listen(self.port, self.ipaddress, function() {
            console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), self.ipaddress, self.port);
        });
    };
};

var zapp = new SampleApp();
zapp.initialize();
zapp.start();