require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose')
const postbackHandler = require('./handlers/postback.js')
const messageHandler = require('./handlers/message.js')


const BootBot = require('bootbot');

const bot = new BootBot({
  accessToken: process.env.FB_PAGE_ACCESS_TOKEN,
  verifyToken: '123',
  appSecret: '470d291ea5c472ff709b6358843a1b88'
});


var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var app = express();
app.use(bodyParser.json())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

mongoose.connect('mongodb://localhost:27017/junction', {useNewUrlParser: true, useCreateIndex: true})
  .then(() => {
    console.log('MONGODB CONNECTION SUCCESFULL')
    bot.on('postback', (payload, chat) => {
      console.log(payload)
      chat.say("postback")
    })

    bot.on('message', (payload, chat) => {
      console.log(payload)
      let handler = new messageHandler(payload, payload.sender.id)
      handler.getResponse(chat).then(message => {
        console.log('sent')
      })
    })

    bot.start()
  }, (err) => {
    console.log('connection error:', err)
  })
