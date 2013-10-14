var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

var UserSchema = new Schema({   
            username        : { type: String, unique: true },
            hash            : { type: String },
            email           : { type: String, unique: true },
            dateCreated     : { type: Date },
            lastLogin       : { type: Date },
            role            : { type: Number }
        });

exports.UserSchema = UserSchema;
