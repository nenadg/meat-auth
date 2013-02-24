// Dependencies
var http = require('http');
var path = require('path');
var express = require('express');
var layouts = require('express-ejs-layouts');
var mongoose = require('mongoose');
var mongourl = require('./shared/mongourl');

var routes = require('./routes');
var login = require('./routes/login');
var auth = require('./auth/auth');
var users = require('./routes/users');

var db = 'auth-db';

mongourl.generate(function(url) { mongoose.connect(url) }, db);

var app = module.exports = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  
  // Registers .ejs static file as .html
  app.engine('.html', require('ejs').__express);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'html');
  // app.use(express.favicon(__dirname + '/favicon.ico', {maxAge: 86400000}));
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  
  // Signed cookies use this
  app.use(express.cookieParser('sekreto-momento'));
  app.use(express.session());
  
  // For ejs layouting
  app.use(layouts);
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  
});


app.use(function(req, res, next){
  var err = req.session.error
    , msg = req.session.success;
  delete req.session.error;
  delete req.session.success;
  res.locals.message = '';
  if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
  if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
  next();
});

// Dev error handling
app.configure('development', function(){
  app.use(express.errorHandler());
});


// Routes
app.get('/', routes.index);
app.get('/login', login.login);
app.post('/login', login.login);
app.get('/logout', login.logout);
app.get('/users', auth.restrict, users.list);
app.get('/users/create', auth.restrict, users.create);
app.post('/users/create', auth.restrict, users.create);
app.get('/users/remove/:id', auth.restrict, users.remove);
app.post('/users/register', users.register);

// Defaults
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
