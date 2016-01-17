var crypto = require("crypto");
var mongoose = require("mongoose");
var async = require('async');
var AuthError = require('../errors').AuthError;

var schema = mongoose.Schema({
    name:{
       type: String,
       required: true,
       unique: true
    },
    hashedPassword:{
        type: String,
        required:true
    },
    salt: {
        type: String,
        required: true
    },
    created:{
        type: Date,
        default: Date.now()
    }
});

schema.methods.encryptPassword = function(password){
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
}

schema.virtual('password')
    .set(function(password){
        this._plainPassword = password;
        this.salt = Math.random().toString();
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function(){
        return this._plainPassword;
    });

schema.methods.checkPassword = function(password){
    return this.hashedPassword == this.encryptPassword(password);
};

schema.static('autorize', function(name, password, callback){
    var User = mongoose.models.User;
    async.waterfall([
        function(callback){
            User.findOne({ name: name }, callback);
        }, function(user, callback){
            if(user) {
                if(user.checkPassword(password)){
                    callback(null, user);
                } else {
                    callback(new AuthError("Invalid password"));
                }
            } else {
                (new User({name: name, password: password})).save(callback)
            }
        }
    ], callback);
});

if(mongoose.models.User){
    module.exports = mongoose.models.User;
} else {
    module.exports = mongoose.model('User', schema);
}

