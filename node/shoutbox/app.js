var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require("method-override");
var session = require("express-session");


var entries = require('./routes/entries');
var register = require("./routes/register");
var login = require("./routes/login");
var messages = require("./lib/messages");
var user = require("./lib/middleware/user");
var validate = require("./lib/middleware/validate");
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());
app.use(cookieParser("your secret here"));
app.use(session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(user);
app.use(messages);
app.get('/', entries.list);
app.get("/post", entries.form);
app.post("/post", 
	validate.required(entry.title),
	validate.lengthAbove(entry.title, 4),
	entries.submit);
app.get("/login", login.form);
app.post("/login", login.submit);
app.get("/logout", login.logout);
app.get("/register", register.form);
app.post("/register", register.submit);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

app.listen(3000);
module.exports = app;
