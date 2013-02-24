var provider = require('../auth/provider').provider;
var provider = new provider();

exports.index = function(req, res){
  if(req.session.user != undefined){
    provider.findById(req.session.user._id, function(error, user) {
        res.render('index', { title: 'Hello node', username : req.session.user.name, userstatus : req.session.user.isOnline });
    });
  } else {
        res.render('index', { title: 'Hello node', username : '', userstatus : false });
  }
};
