var HttpError = require('errors').HttpError;

module.exports = function(req, res, next){
    if(!req.session.user) {
        return next(new HttpError(401,"Not autorized"));
    }
    next();
}