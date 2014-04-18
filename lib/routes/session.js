/**
 * Created by: dhayes on 4/16/14.
 * Filename: session
 */
'use strict';

var auth = require('../configuration/auth');
var passport = require('passport');

module.exports = function(app) {

    app.get('/auth/session', auth.ensureAuthenticated, function (req, res) {
        res.json(req.user.user_info);
    });
    app.post('/auth/session', function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
            var error = err || info;
            if (error) { return res.json(400, error); }
            req.logIn(user, function(err) {
                if (err) { return res.send(err); }
                res.json(req.user.user_info);
            });
        })(req, res, next);
    });

    app.del('/auth/session', function (req, res) {
        if(req.user) {
            req.logout();
        }
        res.send(200);
    });
};

