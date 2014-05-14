var app = {};

require('./config/_settings')(app);
require('./config/environment/development')(app);

var exit = require('gulp-exit'),
  gulp = require('gulp'),
  livereload = require('gulp-livereload'),
  nodemon = require('gulp-nodemon'),
  uglify = require('gulp-uglify'),
  server = livereload(app.config.liveReload.port),
  paths = {
    app: 'server.js',
    build : app.config.buildDir,
    css: app.config.publicDir + 'css/**/*',
    views: './app/views/**/*',
    img: app.config.publicDir + 'img/**/*',
    lib: app.config.publicDir + 'lib/**/*',
    js: [app.config.publicDir + 'js/**/*', 'app/**/*.js'],
  };


// CONDITIONAL REQUIREMENTS

  // STYLES
  if ( app.config.engines.css === 'stylus' ) {
    var stylus = require('gulp-stylus');
  }

  // SASS
  if ( app.config.engines.css === 'sass' ) {
    var sass = require('gulp-sass');
  }

  // LESS
  if ( app.config.engines.css === 'less' ) {
    var less = require('gulp-less');
  }

  // JADE
  if ( app.config.engines.html === 'jade' ) {
    var jade = require('gulp-jade');
  }


// DEFAULT TASK
gulp.task('default', ['nodemon', 'css', 'watch']);

// HEROKU
gulp.task('heroku', ['nodemon', 'css', 'watch']);


// WATCH FILES FOR CHANGES
gulp.task('watch', function() {

  console.log('Running gulp task "WATCH"');

  // LIVE RELOAD
  if ( app.config.liveReload.use === true ) {

    // ASSETS
    gulp.watch(paths.css).on('change', function(file) {
      server.changed(file.path);
    });

    gulp.watch(paths.img).on('change', function(file) {
      server.changed(file.path);
    });

    gulp.watch(paths.js).on('change', function(file) {
      server.changed(file.path);
    });


    // VIEWS
    if ( app.config.engines.html === 'jade' ) {
      gulp.watch(paths.views + '.jade').on('change', function(file) { server.changed(file.path); });
    }
    if ( app.config.engines.html === 'ejs' ) {
      gulp.watch(paths.views + '.ejs').on('change', function(file) { server.changed(file.path); });
    }
    if ( app.config.engines.html === 'hbs' ) {
      gulp.watch(paths.views + '.hbs').on('change', function(file) { server.changed(file.path); });
    }
    if ( app.config.engines.html === 'hogan' || app.config.engines.html === 'mustache' ) {
      gulp.watch(paths.views + '.mustache').on('change', function(file) { server.changed(file.path); });
    }

  }

});

// Get and render all .styl files recursively
gulp.task('css', function () {

    console.log('Running gulp task "CSS"');

    if ( app.config.engines.css === 'stylus' ) {
      gulp.src('./public/css/**/*.styl')
          .pipe(stylus())
          .pipe(gulp.dest( app.config.publicDir + '/css'));
    }

    if ( app.config.engines.css === 'sass' ) {
      console.log('Compiling Sass');
      gulp.src('./public/css/*.scss')
          .pipe(sass())
          .pipe(gulp.dest( app.config.publicDir + '/css'));
    }

});


// BUILD TASK TO RENDER TEMPLATES TO HTML + COPY & MINIFY ASSETS
gulp.task('build', function () {

  console.log('Running gulp task "HTML"');

  var siteData = {
    site : {
      name : app.site.name,
      dir : {
        css : "../public/css/",
        js : "../public/js/",
        img : "../public/img/",
        lib : "../public/lib/"
      }
    }
  };

  // PROCESS HTML TEMPLATES
  if ( app.config.engines.html === 'jade' ) {

    console.log( 'Building HTML from: ' + paths.views + '.jade');
    gulp.src( paths.views + '.jade' )
      .pipe(jade({
        locals: siteData
      }))
      .pipe(gulp.dest( paths.build ))

  }

  // MINIFY JS
  console.log( 'Minify JS from: ' +  paths.js[0] + '.js');
  gulp.src( paths.js[0] + '.js' )
    .pipe(gulp.dest( paths.build + 'public/js/' ))

  // MINIFY CSS
  console.log( 'Minify CSS from: ' +  paths.css + '.css');
  gulp.src( paths.css )
    .pipe(uglify({outSourceMap: true}))
    .pipe(gulp.dest( paths.build + 'public/css/' ))

  // COPY LIB FILES
  console.log( 'Copy lib files from: ' +  paths.lib );
  gulp.src( paths.lib )
    .pipe(gulp.dest( paths.build + 'public/lib/' ))
    .pipe( exit() )

  // COPY IMAGES
  console.log( 'Copy images from: ' +  paths.img );
  gulp.src( paths.img )
    .pipe(gulp.dest( paths.build + 'public/img/' ))
    .pipe( exit() )

});


gulp.task('reload', function () {

  if ( app.config.liveReload.use === true ) {
    livereload(); // REFRESH BROWSER ON RESET
  }

});


// MONITOR SERVER FOR CHANGES & RESTART
gulp.task('nodemon', function() {

  console.log('Running gulp task "NODEMON"');

  nodemon({
    script: paths.app,
    ext: 'js, ejs, hbs, jade, html, mustache, styl, less, scss',
    ignore: ['README.md', 'node_modules/**', '.DS_Store']
  })
  .on('change', ['css'])
  .on('restart', ['reload'])

});
