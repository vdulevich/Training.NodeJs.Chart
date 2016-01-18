var mongoose = require('lib/mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);


module.exports = new MongoStore({ mongooseConnection : mongoose.connection});