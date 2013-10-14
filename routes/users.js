var auth = require('../auth/module');
var provider = require('../auth/provider').provider;
var provider = new provider();

// list all
exports.list = function(req, res) {
  provider.findAll(function(err, users) {
    res.render('users/list', { 
                title: 'Korisnici',
                users: users });
  });
};

// create
exports.create = function(req, res) {
  if(req.method === 'GET'){
    res.render('users/create', {
                title: 'Novi korisnik' });   
  } else if(req.method === 'POST') {
    provider.save({
        username: req.param('username'),
        password: req.param('password'),
        email: req.param('email'),
        role: req.param('role')
    }, function(error, docs) {
       res.redirect('/users');
    });
  }  
};

// register
exports.register = function(req, res) {
    provider.save({
        username: req.param('username'),
        password: req.param('password'),
        email: req.param('email'),
        role: req.param('role'),
        isNew: req.param('isNew')
    }, function(error, docs) {
       res.redirect('/');
    });
};

// read&update
exports.user = function(req, res) {
    if(req.method === 'GET'){
        provider.findByName(req.param('name'), function(err, user) {
            res.render('users/update', {
                title: 'Izmijeni ' + user.username,
                user: user
            });
        });
    } else if(req.method === 'POST'){
        var params = { username: req.param('username'), password: req.param('password'), email: req.param('email'), role: req.param('role') };
        provider.update(params, function(err){ if(!err) res.redirect('/users'); else { res.redirect('/users/update/' + params.username); } });   
    }
};

// remove
exports.remove = function(req, res) {
    provider.remove(req.param('id'), function(err, user) {
        res.redirect('/users');
    });
};
