var sessonStore = require('lib/sessionStore');
var cookie = require('cookie');
var cookieParser = require('cookie-parser');
var async = require('async');
var HttpError = require('errors').HttpError;
var User = require('models/user');
var config = require('config');


function LoadSesson(sid, callback){
    sessonStore.load(sid, function(err, session){
        if(err) callback(err);
       if(arguments.length == 0){
           callback(null, null);
       } else {
           callback(null, session);
       }
    });
}

function LoadUser(session, callback){
    if(!session.user){
        return callback(null, null);
    }
    User.findById(session.user, function(err, user){
        if(err) callback(err);
        callback(null, user);
    });
}

function onAutorization(handshake, callback){
    async.waterfall([function(callback){
        handshake.cookies = cookie.parse(handshake.headers.cookie || '');
        var sid = cookieParser.signedCookie(
            handshake.cookies[config.get('session').name],
            config.get('session').secret);
        LoadSesson(sid, callback);
    },function(session, callback){
        if(!session) {
            callback(new HttpError(401, "No session"));
        }
        handshake.session = session;
        LoadUser(session, callback);
    }, function(user, callback){
        if(!user){
            callback(new HttpError(403, "Anonymous session denied"))
        }
        handshake.user = user;
        callback(null);
    }], function(err){
        if(!err){
            return callback(null, true);
        }
        if(err instanceof HttpError){
            return callback(null, false);
        }
        return callback(err);
    })
}

function onConnection(io, socket){
    socket.on('message', onMessage.bind(null, socket));
    socket.on('disconnect', onDisconnect.bind(null, io, socket));
    socket.broadcast.emit('join', socket.request.user.get('name'));
}

function onMessage(socket, message, callback){
    socket.broadcast.emit('message', { message: message, user: socket.request.user.get('name') });
    callback && callback({ message: message, user: socket.request.user.get('name') });
}

function onDisconnect(io, socket){
    socket.broadcast.emit('leave', socket.request.user.get('name'));
}

module.exports = function(server) {
    var io = require('socket.io')(server);
    io.on('connection', onConnection.bind(null, io));
    io.set('authorization', onAutorization);
    return io;
}

