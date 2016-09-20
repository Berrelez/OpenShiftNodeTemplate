var express = require('express');
var session = require('express-session');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var helmet = require('helmet');

//Import routes
var routes = require('./routes/index');

var app = express();

app.disable('x-powered-by');

//Security settings
app.use(helmet.xssFilter());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'","'unsafe-inline'",'https://maxcdn.bootstrapcdn.com'],
    styleSrc: ["'self'","'unsafe-inline'",'https://maxcdn.bootstrapcdn.com'],
    imgSrc: ["'self'"],
    fontSrc: ['https://maxcdn.bootstrapcdn.com'],
    connectSrc: [],
  },

  reportOnly:false,
  setAllHeaders: false,
  disableAndroid: false

}));

app.set('trust proxy', 1) // trust first proxy
app.use( session({
   secret : 's3Cur3',
   name : 'sessionId',
  })
);

//view engine setup
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, './public')));

//Configure Routes
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  //res.send('error'+ err.message );
  res.render('error.ejs', {title:err.status, error: err.message, pageName: ""});
  return;
});


module.exports = app;