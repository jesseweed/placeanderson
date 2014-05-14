module.exports = function(app, tesla) {

  var dir = '../../',
      fs = require('fs'),
      colors = require('colors');
      tesla = require(dir + 'lib/tesla')(app),
      controllers = dir + 'app/controllers/',
      routes = dir + 'app/routes/';


  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  //
  // - - - - - - - - - - - - CUSTOM ROUTES GO HERE - - - - - - - - - - - - - //
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  //


    // HELLO WORLD ROUTER - example of loading controller if specific path is matched
    app.get("/:width/:height", function(req, res) {
      // require(controllers + 'hello/worldController')(app, res, res);
      // res.send('width: ' + req.params.width + ' - height: ' + req.params.height);


      var img = './public/img/';

      var num = Math.floor( Math.random() * 17 );

      if (num < 10 ) num = '0' + num;

      if (num === 00 ) num = '01';

      if (fs.existsSync( img + num + '.jpg' )) {
        src = num + '.jpg';
      } else if (fs.existsSync( img + num + '.png' )) {
        src = num + '.png';
      } else if (fs.existsSync( img + num + '.gif' )) {
        src = num + '.gif';
      } else {
        src = img + '01.jpg';
      }

      app.site.img = {
        w: req.params.width,
        h: req.params.height,
        src: src
      };

      require(controllers + 'imageController')(app, res, res);

    });


  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  //
  // - - - DANGER ! DON'T EDIT BELOW THIS LINE UNLESS YOU KNOW WHAT YOU'RE DOING - - - //
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  //


    // AUTO ROUTER (THIS SHOULD COME AFTER ANY CUSTOME ROUTES)
    if ( app.config.autoRouting === true ) {
      tesla.log( 'INFO:'.blue + ' using auto router');
      require(routes + 'auto')(app, tesla);
    }

    // ERROR HANDLER
    require(routes + 'errors')(app);

};
