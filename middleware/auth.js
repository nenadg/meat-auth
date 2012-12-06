// auth module
var hash = require('./pass').hash;
var authProvider = require('../middleware/authProvider').authProvider;
var authProvider = new authProvider();

exports.authenticate = function(req, fn) {
    if (!module.parent) console.log('parent: authenticating %s', req.body.username);
    
    authProvider.findByName(req.body.username, function(error, user) {
        
        if (!user) return fn(new Error('User not found'));
        
        hash(req.body.password, user.salt, function(err, hash) {
            if(err) return fn(err);
            if(hash == user.hash) {
                authProvider.switchStatus(user._id, function(user) {
                    
                    if (user) {
                          // Regenerate session when signing in
                          // to prevent fixation
                          req.session.regenerate(function(){
                              // Store the user's params
                              // in the session store to be retrieved
                              req.session.user = new Object();
                              req.session.user._id = user._id;
                              req.session.user.name = user.username
                              req.session.user.isOnline = user.isOnline;
                              req.session.success = 'Authenticated as ' + user.name;
                              return fn(null, user);
                          });
                        } else {
                             req.session.error = 'Authentication failed';
                             
                             return fn(err);
                        }
                    
                });
                
        
        } else { console.log(err); return fn(err); }
    
        });
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
