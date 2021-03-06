process.env.NODE_ENV = process.env.NODE_ENV || 'production';

// MODULE DEPENDENCIES
require('colors')

var express = require('express'),
  app = module.exports = express(),
  server = require('http').createServer(app),
  tesla, port;


// REQUIRE CONFIG FILES
require('./config/_settings')(app); // MAIN
require('./config/environment')(app); // ENVIRONMENT SPECIFIC

// LOAD TESLA LIB
tesla = require('./lib/tesla')(app);

tesla.log(' ');
tesla.log(' ');
tesla.log('# # # # # # # # # # # # # # # # # # # # # # # # # # # # #'.rainbow);
tesla.log('    > > > FIRING UP THE '.white + 'TESLA'.red + ' SERVER. GET HAPPY! < < < '.white);
tesla.log('# # # # # # # # # # # # # # # # # # # # # # # # # # # # #'.rainbow);
tesla.log(' ');

// REQUIRE ADDITIONAL CONFIG FILES
require('./config/express')(app, tesla); //express settings
require('./app/routes/_setup')(app, tesla); // routes

// START THE APP BY LISTEN ON <PORT>
port = process.env.PORT || app.config.port;

server.listen(port, function(err) {

  tesla.log(' ');
  tesla.log('# # # # # # # # # # # # # # # # # # # # # # # # # # # #'.green);
  tesla.log('        IT\'S ALIVE!'.white + ' TESLA'.red + ' IS UP AND RUNNING.'.white);
  tesla.log('   POINT YOUR BROWSER TO: '.grey + app.site.url.white);
  tesla.log('# # # # # # # # # # # # # # # # # # # # # # # # # # # #'.green);

});

// EXPOSE APP
exports = module.exports = app;