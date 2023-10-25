var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var fileUpload = require('express-fileupload');
var compression = require('compression');

const app_const = require('./app_const');
var indexRouter = require('./routes/index');
var sseRouter = require('./routes/sseRouter');
var importMapRouter = require('./routes/importMapRouter');
var statusRouter = require('./routes/statusRouter');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.use(compression());
app.use(fileUpload());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(app_const.FRONT_BUILD));

app.use('/', indexRouter);
app.use('/import-map-events', sseRouter);
app.use('/import-map', importMapRouter);
app.use('/import-status', statusRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
