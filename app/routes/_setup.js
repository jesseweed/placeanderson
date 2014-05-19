module.exports = function(app, tesla) {

  var dir = '../../',
      fs = require('fs'),
      colors = require('colors');
      tesla = require(dir + 'lib/tesla')(app),
      controllers = dir + 'app/controllers/',
      routes = dir + 'app/routes/',
      easyimg = require('easyimage');


    // HELLO WORLD ROUTER - example of loading controller if specific path is matched
    app.get("/:width/:height", function(req, res) {

      // SELECT RANDOM IMAGE
      var width = req.params.width,
          height = req.params.height,
          images = new Array,
          dir = {
            src : './public/img/src/',
            dest : './tmp/'
          },
          files = fs.readdirSync( dir.src );

      // DETERMINE IMAGE TYPE
      for(var i in files) {

          if ( files[i].indexOf(".jpg") > 0 || files[i].indexOf(".jpeg") > 0 || files[i].indexOf(".gif") > 0 || files[i].indexOf(".png") > 0 ) {

            if ( files[i].indexOf(".jpg") > 0 ) {

              var file = {
                src: files[i],
                dest: files[i].replace('.jpg', '_' + width + '_' + height + '.jpg'),
                type: 'jpg',
              }

              images.push(file);

            }

            else if ( files[i].indexOf(".jpeg") > 0 ) {

              var file = {
                src: files[i],
                dest: files[i].replace('.jpeg', '_' + width + '_' + height + '.jpeg'),
                type: 'jpeg',
              }

              images.push(file);

            }

            else if ( files[i].indexOf(".gif") > 0 ) {

              var file = {
                src: files[i],
                dest: files[i].replace('.gif', '_' + width + '_' + height + '.gif'),
                type: 'gif',
              }

              images.push(file);

            }

            else if ( files[i].indexOf(".png") > 0 ) {

              var file = {
                src: files[i],
                dest: files[i].replace('.png', '_' + width + '_' + height + '.png'),
                type: 'png',
              }

              images.push(file);

            }

          }

      } // END

      var pic = images[Math.floor(Math.random()*images.length)];

      easyimg.thumbnail( {
        src: dir.src + pic.src,
        dst: dir.dest + pic.dest,
        width: width,
        height: height,
        x:0, y:0
      },

      function(err, image) {
        fs.readFile(dir.dest + pic.dest, function(err, data) {

          if (err) {
            console.log(err);
            res.send(err)
          } else {
            res.contentType('image/' + pic.type);
            res.end( data );
          }


        });
      }

    );


    });


    // AUTO ROUTER (THIS SHOULD COME AFTER ANY CUSTOME ROUTES)
    if ( app.config.autoRouting === true ) {
      tesla.log( 'INFO:'.blue + ' using auto router');
      require(routes + 'auto')(app, tesla);
    }

    // ERROR HANDLER
    require(routes + 'errors')(app);

};
