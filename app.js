var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const session = require('express-session');
const flash = require('connect-flash');
// const mongoose = require('mongoose');
// const MongoStore = require('connect-mongo')(session);
const connectDB = require('./config/db.js')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/home', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

//for redirect function
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/home'); // create your index.html file
});
app.get('/home', function(req, res) {
  res.redirect('/home');
});
// Connect Database
connectDB()

const port = process.env.PORT || 8082

app.listen(port, () => console.log(`Server running on port ${port}`))

module.exports = app;
