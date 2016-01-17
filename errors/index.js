var util = require("util");

var HttpError = function(code, message){
    Error.apply(this, arguments);
    this.status = code;
    this.message = message;
    Error.captureStackTrace(this, HttpError);
}

util.inherits(HttpError, Error);
HttpError.prototype.name = "HttpError";


var AuthError = function(message){
    Error.apply(this, arguments);
    this.message = message;
}

util.inherits(AuthError, Error);
AuthError.prototype.name = "AuthError";


module.exports.HttpError = HttpError;
module.exports.AuthError = AuthError;