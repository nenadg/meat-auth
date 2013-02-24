// Article provider
var provider = require('../auth/provider').provider;
var auth = require('../auth/auth');

var provider = new provider();

// list all
exports.list = function(req, res) {
  provider.findAll(function(err, users) {
    res.render('users/list', { locals: 
                { title: 'all users', 
                  users: users,
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
    console.log('post...');
    provider.save({
        username: req.param('username'),
        password: req.param('password'),
        email: req.param('email')
    }, function(error, docs) {
       res.redirect('/users');
    });
  }  
};

exports.register = function(req, res) {
    provider.save({
        username: req.param('username'),
        password: req.param('password'),
        email: req.param('email')
    }, function(error, docs) {
       res.redirect('/');
    });
};

// read
exports.user = function(req, res) {
    provider.findById(req.param('id'), function(err, user) {
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
    provider.remove(req.param('id'), function(err, user) {
        res.redirect('/users');
    });
};
