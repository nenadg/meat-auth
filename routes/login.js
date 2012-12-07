var authenticate = require('../middleware/auth').authenticate;
var referer = require('../middleware/auth').referer;
var authProvider = require('../middleware/authProvider').authProvider;
var authProvider = new authProvider();

var backURL;

exports.login = function(req, res){
    switch(req.method){
        case('GET'):
            referer.check(req);
            backURL = referer.ref;
            authProvider.findAll(function(err, users){
                (users.length == 0) ? res.render('auth/register', { title: 'Login page', layout: 'loginLayout' }) : res.render('auth/login', { title: 'Login page', layout: 'loginLayout' });
            });
            
            break;
        case('POST'):
            authenticate(req, function(err, user) { (user) ? res.redirect(backURL) : res.redirect('/login') });
            break;
    }
}

exports.logout = function(req, res){
  authProvider.registerLogin(req.session.user._id, function(){
    req.session.destroy(function(){
        res.redirect('/');
    });
  });
 
}

