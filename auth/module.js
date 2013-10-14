// auth module
var bcrypt = require('bcrypt');
var provider = require('./provider').provider;
var provider = new provider();

exports.authenticate = function(req, res, next) {
    
    provider.findByName(req.body.username, function(error, user) {
        if(error) { return next('auth-failed') }
        
        if(user){
            bcrypt.compare(req.body.password, user.hash, function(err, result) {
                if(result){
                    provider.registerLogin(user._id, function(user) {
                        if(user){
                            req.session.user = {
                                 _id      : user._id,
                                 name     : user.username,
                                 isOnline : (user != undefined),
                                 lastLogin: user.lastLogin,
                                 success  : 'Authenticated as ' + user.username,
                                 role     : user.role
                            }

                            //if (req.body.rememberme == 'on')
                                // send persistance cookie

                            return next(null, user);    
                        } else {
                             return next('auth-failed') }
                    });
                } else {
                    return next('auth-failed') }
             });
        } else {
            return next('auth-failed');
        }
    });
}

exports.restrict = function(req, res, next) {
    // limited - unaccessible locations, deal with this in anyway you want ...
    // cookie authentication is not supported but it is super simple to implement
    // just uncomment the rest of this clause, and add cookie in authenticate request
    if (req.session.user /* || req.cookie.yourcookie */) {
        var limited = { 
                        '/users': (req.session.user.role == 100)? true: false,
                        '/users/create': (req.session.user.role == 100)? true: false,
                        '/users/remove/:id': (req.session.user.role == 100)? true: false,
                        '/users/update/:name': (req.session.user.role == 100)? true: false
                       }
                    
    
        if(limited[req.route.path])
            next();
    
    } else {
        // uncomment if needed, but remove res.redirect
        // res.send(401, 'Unauthorized'); 
        req.session.referer = req.url;
        res.redirect('/login');
    }
}

exports.referer = function(req){
    var ret = (req.session.referer != undefined)? req.session.referer : "/";
    return ret;
}

