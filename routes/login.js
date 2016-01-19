var express = require('express');
var router = express.Router();
var User = require('models/user');
var errors = require('errors');


router.get('/', function(req, res, next){
    res.render('login');
});

router.post('/', function(req, res, next){
    User.autorize(req.body.email, req.body.password, function(err, user){
        if(err) {
            if (err instanceof errors.AuthError) {
                return next(new errors.HttpError(403, err.message));
            } else if(err instanceof mongoose.Error.ValidationError){
                return next(new errors.HttpError(403, err.message));
            }
            else {
                res.json(err);
                return;
                //return next(err);
            }
        }
        req.session.user = user._id;
        res.json({name: user.name});
    });
});

module.exports = router;
