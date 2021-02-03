// Load app configuration
module.exports = require(__dirname + '/../config/environment/' + process.env.NODE_ENV + '.js') || {} ;
