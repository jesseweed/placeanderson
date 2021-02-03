module.exports = function(app, tesla) {

  require('colors');

  const dir = '../../',
      fs = require('fs'),
      routes = dir + 'app/routes/',
      Jimp = require('jimp');

    // HELLO WORLD ROUTER - example of loading controller if specific path is matched
    app.get("/:width/:height", function(req, res) {

      // SELECT RANDOM IMAGE
      const width = parseInt(req.params.width, 10),
          height = parseInt(req.params.height, 10),
          images = new Array,
          dir = {
            src : './public/img/src/',
            dest : './tmp/'
          },
          files = fs.readdirSync( dir.src );

      // DETERMINE IMAGE TYPE
      for(const i in files) {

          if ( files[i].indexOf(".jpg") > 0 || files[i].indexOf(".jpeg") > 0 || files[i].indexOf(".gif") > 0 || files[i].indexOf(".png") > 0 ) {

            if ( files[i].indexOf(".jpg") > 0 ) {

              const file = {
                src: files[i],
                dest: files[i].replace('.jpg', '_' + width + '_' + height + '.jpg'),
                type: 'jpg',
              }

              images.push(file);

            }

            else if ( files[i].indexOf(".jpeg") > 0 ) {

              const file = {
                src: files[i],
                dest: files[i].replace('.jpeg', '_' + width + '_' + height + '.jpeg'),
                type: 'jpeg',
              }

              images.push(file);

            }

            else if ( files[i].indexOf(".gif") > 0 ) {

              const file = {
                src: files[i],
                dest: files[i].replace('.gif', '_' + width + '_' + height + '.gif'),
                type: 'gif',
              }

              images.push(file);

            }

            else if ( files[i].indexOf(".png") > 0 ) {

              const file = {
                src: files[i],
                dest: files[i].replace('.png', '_' + width + '_' + height + '.png'),
                type: 'png',
              }

              images.push(file);

            }

          }

      } // END

      const IMG_SRC = images[Math.floor(Math.random()*images.length)].src;

      Jimp.read(`${dir.src}${IMG_SRC}`).then(image => {
        image
          .cover(width, height, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE)
          .quality(100);

        const mime = image.getMIME();

        image.getBufferAsync(mime).then((data) => {
          res.contentType(mime);
          res.end( data );
        });

      })
      .catch(err => {
        console.error('Error processing image', err);
      });

    });


    // AUTO ROUTER (THIS SHOULD COME AFTER ANY CUSTOM ROUTES)
    if ( app.config.autoRouting === true ) {
      tesla.log( 'INFO:'.blue + ' using auto router');
      require(routes + 'auto')(app, tesla);
    }

    // ERROR HANDLER
    require(routes + 'errors')(app);

};
