var mongoose = require('mongoose');
var hash = require('../middleware/pass').hash;

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var User = new Schema({   
    username            : { type: String, unique: true },
    salt                : { type: String },
    hash                : { type: String },
    email               : { type: String, unique: true },
    dateCreated         : { type: Date },
    isOnline            : { type: Boolean },
    lastLogin           : { type: Date },
    sessionTimeSpan     : { type: Number }
});

mongoose.model('User', User);
var User = mongoose.model('User');

authProvider = function(){};

// Find all
authProvider.prototype.findAll = function(callback) {
    User.find({}, function(err, users) {
        callback(null, users);
    });
};

// Find one by name
authProvider.prototype.findByName = function(name, callback) {
    User.find({ username: name }, function(err, user) {
        if(!err){
            callback(null, user[0]);
        }
    });
};

// Find on by ID
authProvider.prototype.findById = function(id, callback) {
    User.findById(id, function(err, users) {
        if(!err){
            callback(null, users);
        }
    });
};

// Create
authProvider.prototype.save = function(params, callback) {
    var hashed = hash(params['password'], function(err, salt, hash){
        if (err) throw err;
        // store the salt & hash in the "db"
        var user = new User({username: params['username'], salt: salt, hash: hash, email: params['email'], dateCreated: new Date(), isOnline: false, lastLogin: new Date(), sessionTimeSpan: 0  });
        user.save(function (err) {
            (!err) ? callback() : callback(err);
            //callback();
        });
    });
};

// Remove
authProvider.prototype.remove = function(id, callback) {
    var user = User.findById(id, function(err, users) {
        if(!err){
            user.remove(function(err) {
                callback();
            });
        }
    });
};


// Update
authProvider.prototype.switchStatus = function(id, callback) {
    User.findOne({ _id: id }, function (err, user){
      switch(user.isOnline){
        case(true):
            user.isOnline = false;
            user.save(function (err) {
                callback(user);
            });
            break;
        case(false):
            user.isOnline = true;
            user.lastLogin = new Date();
            user.save(function (err) {
                callback(user);
            });
            break;
        }
    });
    
};

exports.authProvider = authProvider;
