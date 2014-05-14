module.exports = function(app, tesla) {

  var dir = '../../',
      fs = require('fs'),
      colors = require('colors');
      tesla = require(dir + 'lib/tesla')(app),
      controllers = dir + 'app/controllers/',
      routes = dir + 'app/routes/',
      qt = require('quickthumb'),
      thumb = require('node-thumbnail').thumb,
      easyimg = require('easyimage');


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
        dest = num + '_' + req.params.width + '_' + req.params.height + '.jpg';
      } else if (fs.existsSync( img + num + '.png' )) {
        src = num + '.png';
        dest = num + '_' + req.params.width + '_' + req.params.height + '.png';
      } else if (fs.existsSync( img + num + '.gif' )) {
        src = num + '.gif';
        dest = num + '_' + req.params.width + '_' + req.params.height + '.gif';
      } else {
        src = '01.jpg';
        dest = '01_' + req.params.width + '_' + req.params.height + '.jpg';
      }

      app.site.img = {
        w: req.params.width,
        h: req.params.height,
        src: src
      };

      var file = './public/img/' + src;

      // easyimg.rescrop( {
      //      src: './public/img/' + src,
      //      dst: './public/.cache/' + dest,
      //      width: req.params.width,
      //      height: req.params.height,
      //      cropwidth: req.params.width,
      //      cropheight: req.params.height,
      //      quality: 100,
      //      fill: true
      //      },
      //   function(err, image) {
      //      if (err) throw err;

      //   }
      // );

      easyimg.thumbnail( {
        src: './public/img/' + src,
        dst: './tmp/' + dest,
        width: req.params.width,
        height: req.params.height,
        x:0, y:0
      },
      function(err, image) {
        fs.readFile('./tmp/' + dest, function(err, data) {

          if (err) {
            console.log(err);
            res.send(err)
          } else {
            res.contentType('image/jpeg');
            res.end( data );
          }


        });
      }
    );


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
