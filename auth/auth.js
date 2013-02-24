// auth module
var bcrypt = require('bcrypt');

var provider = require('./provider').provider;
var provider = new provider();

exports.authenticate = function(req, callback) {
    //if (!module.parent) console.log('parent: authenticating %s', req.body.username);
    
    provider.findByName(req.body.username, function(error, user) {
        
       // if (!user) return fn(new Error('User not found'));
        
        if(user){
            bcrypt.compare(req.body.password, user.hash, function(err, res) {
                // res == true
                if(res){
                    provider.registerLogin(user._id, function(user) {
                        if(user){
                            // regenerate session to prevent fixation
                            req.session.regenerate(function(){
                                req.session.user = {
                                     _id      : user._id,
                                     name     : user.username,
                                     isOnline : (user != undefined),
                                     lastLogin: user.lastLogin,
                                     success  : 'Authenticated as ' + user.name
                                }
                                
                                req.session.secret = '#' + Math.floor(Math.random()*16777215).toString(16); // colored session secret
                                req.session.cookie.maxAge = new Date(Date.now() + 3600000);
                                return callback(null, user)
                             });
                        } else {
                             return callback('auth-failed') }
                    });
                } else {
                    return callback('auth-failed') }
             });
        } else {
            return callback('auth-failed');
        }
    });
}

exports.restrict = function(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.session.error = 'Access denied!';
    req.session.referer = req.url;
    res.redirect('/login');
  }
}

exports.referer = { ref: '', 
                    check: function(req){ (req.session.referer != undefined) ? this.ref = req.session.referer : this.ref = '' } };
