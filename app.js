var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('./lib/mongoose');
var HttpError = require('./errors/index').HttpError;
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var config = require('config');

var checkAuth = require('./middleware/checkAuth');
var login = require('./routes/login');
var logout = require('./routes/logout');
var chart = require('./routes/chart');
var index = require('./routes/index');
var app = express();

// view engine setup
app.engine('ejs', require("ejs-locals"));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev', { immediate: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  cookie: config.get('session').cookie,
  name: config.get('session').name,
  secret: config.get('session').secret,
  store: new MongoStore({ mongooseConnection : mongoose.connection})
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(require('./middleware/sendHttpError'));
app.use(require('./middleware/loadUser'));

app.use('/chart', checkAuth, chart);
app.use('/', index );
app.use('/index', index );
app.use('/login', login );
app.use('/logout', logout);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    console.log(err);
    if(err instanceof HttpError){
      res.sendHttpError(err);
    } else {
      res.status(err.status || 500);
      res.render('error', {
        error: err
      });
    }
  });
}
// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.sendHttpError(err);
});


module.exports = app;

