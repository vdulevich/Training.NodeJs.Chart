#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('app');
var debug = require('debug')('chart:server');
var http = require('http');
var config = require('config');
var Chart = require('lib/chart');

/**
 * Get port from environment and store in Express.
 */
var serverConfig = config.get('server');
var port =  process.env.PORT || serverConfig.port || 5000;

console.log(serverConfig.port);
app.set('port', port);
//app.set('host', serverConfig.host);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/*
* Chart IO
* */

var chart = new Chart(server);

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
