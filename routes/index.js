var authProvider = require('../middleware/authProvider').authProvider;
var authProvider = new authProvider();

exports.index = function(req, res){
  if(req.session.user != undefined){
    authProvider.findById(req.session.user._id, function(error, user) {
        res.render('index', { title: 'Hello node', username : user.username, userstatus : user.isOnline });
    });
  } else {
        res.render('index', { title: 'Hello node', username : '', userstatus : false });
  }
};
