const { Console } = require('console');
const http = require('http');
require('dotenv').config();
const app = require('./app');

// normalizePort function returns a valid port, whether it is provided as a number or a string
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

//our express app nedds to now which port where at
const port = normalizePort(process.env.PORT || 3000);
app.set('port', port);

//Handles listen errors
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      //permission errors
      console.error(bind + ' requires elevated privilages.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      //port number is already in use
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

//to make our node server run our express app
const server = http.createServer(app);

//Sets up the listening as well as the error and listening events.
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe' + address : 'port: ' + port;
  console.log('Listening on ' + bind);

});

server.listen(port);
