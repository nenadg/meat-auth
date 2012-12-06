// Article provider
var authProvider = require('../middleware/authProvider').authProvider;
var auth = require('../middleware/auth');

var authProvider = new authProvider();

// list all
exports.list = function(req, res) {
  authProvider.findAll(function(err, users) {
    res.render('users/list', { locals: 
                { title: 'all users', 
                  users: users,
                  session: req.session.cookie.expires.getMinutes(),
                  username : req.session.user.name, userstatus : req.session.user.isOnline } });
  });
};

// create
exports.create = function(req, res) {
  if(req.method === 'GET'){
    res.render('users/create', {
             locals: {
               title: 'New user',
               username : req.session.user.name, userstatus : req.session.user.isOnline 
             }
    });   
  } else if(req.method === 'POST') {
    
    authProvider.save({
        username: req.param('username'),
        password: req.param('password'),
        email: req.param('email')
    }, function(error, docs) {
       res.redirect('/users');
    });
  }  
};

exports.register = function(req, res) {
    authProvider.save({
        username: req.param('username'),
        password: req.param('password'),
        email: req.param('email')
    }, function(error, docs) {
       res.redirect('/');
    });
};

// read
exports.user = function(req, res) {
    authProvider.findById(req.param('id'), function(err, user) {
        res.render('users/user', {
          locals: {
            title: user.username,
            email: user.email,
            dateCreated: user.dateCreated
          }
        });
      });
};

// remove
exports.remove = function(req, res) {
    authProvider.remove(req.param('id'), function(err, user) {
        res.redirect('/users');
    });
};
