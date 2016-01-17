var mongoose = require('./lib/mongoose');
var async = require('async');


var db = mongoose.connection.db;

function dbOpen(callback){
    console.log('Open');
    mongoose.connection.on('open', callback);
}

function dbDrop(callback){
    console.log('Drop');
    db.dropDatabase(callback);
}

function dbClose(callback){
    console.log('Close');
    db.close(callback);
}

function  requireModels(callback){
    console.log('Require models');
    require('./models/user');
    async.each(Object.keys(mongoose.models), function(modelName, callback){
        mongoose.models[modelName].ensureIndexes(callback);
    }, callback);
}

function createUsers(callback){
    console.log('Create users');
    var userDataItems = [
        { name: "User1", password: "User1" },
        { name: "User2", password: "User2" },
        { name: "User3", password: "User3" }
    ];
    async.each(userDataItems, function(userData, callback) {
        var user = new mongoose.models.User(userData);
        user.save(callback);
    }, function(err){
        callback(err);
    });
}

async.series([
    dbOpen,
    dbDrop,
    requireModels,
    createUsers
], function(err, result){
    dbClose();
    if(err) throw  err;
});
