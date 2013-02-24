var authenticate = require('../auth/auth').authenticate;
var referer = require('../auth/auth').referer;
var provider = require('../auth/provider').provider;
var provider = new provider();

var backURL;

exports.login = function(req, res){
    switch(req.method){
        case('GET'):
            referer.check(req);
            backURL = referer.ref;
            provider.findAll(function(err, users){
                (users.length == 0) ? res.render('auth/register', { title: 'Login page', layout: 'loginLayout' }) : res.render('auth/login', { title: 'Login page', layout: 'loginLayout' });
            });
            
            break;
        case('POST'):
            authenticate(req, function(err, user) { (user) ? res.redirect(backURL) : res.redirect('/login') });
            break;
    }
}

exports.logout = function(req, res){
  provider.registerLogin(req.session.user._id, function(){
    req.session.destroy(function(){
        res.redirect('/');
    });
  });
 
}

