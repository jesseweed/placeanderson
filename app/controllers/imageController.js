// HELLO/WORLD
module.exports = function(app, req, res) {

  res.render('image', {
    title : app.site.name + ' - Hello World',
    site: app.site
  });

};