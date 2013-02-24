var mongoose = require('mongoose')
    , Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var UserSchema = require('../shared/schema').UserSchema;
var User = mongoose.model('User', UserSchema);

var provider = function(){};

// Find all
provider.prototype.findAll = function(callback) {
    User.find({}, function(err, users) {
        callback(null, users);
    });
};

// Find one by name
provider.prototype.findByName = function(name, callback) {
    User.find({ username: name }, function(err, user) {
        if(!err){
            callback(null, user[0]);
        }
    });
};

// Find on by ID
provider.prototype.findById = function(id, callback) {
    User.findById(id, function(err, users) {
        if(!err){
            callback(null, users);
        }
    });
};

// Create
provider.prototype.save = function(params, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(params['password'], salt, function(err, hash) {   
            console.log('hashing...');
            var user = new User({ 
                username: params['username'], 
                hash: hash, 
                email: params['email'], 
                dateCreated: new Date(), 
                isOnline: false, 
                lastLogin: new Date(), 
                sessionTimeSpan: 0
            });
            
            user.save(function (err) {
                (!err) ? callback() : callback(err);
            });
         });   
    });
};

// Remove
provider.prototype.remove = function(id, callback) {
    var user = User.findById(id, function(err, users) {
        if(!err){
            user.remove(function(err) {
                callback();
            });
        }
    });
};


// Update
provider.prototype.registerLogin = function(id, callback) {
    User.findOne({ _id: id }, function (err, user){
     
            user.lastLogin = new Date();
            user.save(function (err) {
                callback(user);
            });
            
        });
    
};

exports.provider = provider;
