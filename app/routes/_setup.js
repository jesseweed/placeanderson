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



      // SELECT RANDOM IMAGE
      var width = req.params.width,
          height = req.params.height,
          images = new Array,
          dir = {
            src : './public/img/src/',
            dest : './tmp/'
          },
          files = fs.readdirSync( dir.src );

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

      }


      // console.log(images);

      var pic = images[Math.floor(Math.random()*images.length)];

      // var src = pic.replace('')

      console.log(pic);


      // var num = Math.floor( Math.random() * 17 );

      // if (num < 10 ) num = '0' + num;

      // if (num === 00 ) num = '01';

      // if (fs.existsSync( img + num + '.jpg' )) {
      //   src = num + '.jpg';
      //   dest = num + '_' + req.params.width + '_' + req.params.height + '.jpg';
      // } else if (fs.existsSync( img + num + '.png' )) {
      //   src = num + '.png';
      //   dest = num + '_' + req.params.width + '_' + req.params.height + '.png';
      // } else if (fs.existsSync( img + num + '.gif' )) {
      //   src = num + '.gif';
      //   dest = num + '_' + req.params.width + '_' + req.params.height + '.gif';
      // } else {
      //   src = '01.jpg';
      //   dest = '01_' + req.params.width + '_' + req.params.height + '.jpg';
      // }
      // // END



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
