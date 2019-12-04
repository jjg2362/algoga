var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var mainRouter = require('./routes/index');
var detailRouter = require('./routes/detail');

// view engine setup
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.static('public'));
app.use(bodyParser.json());

app.use(session({
  secret: 'asd',
  resave: false,
  saveUninitialized: false,
}));

app.use(express.static('public'));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: true}));
app.use('/', mainRouter);
app.use('/detail', detailRouter);

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
