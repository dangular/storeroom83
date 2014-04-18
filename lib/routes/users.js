/**
 * Created by: dhayes on 4/17/14.
 * Filename: users
 */


'use strict';

var logger = require('../logger'),
    mongoose = require('mongoose'),
    auth = require('../configuration/auth'),
    User = mongoose.model('User'),
    ObjectId = mongoose.Types.ObjectId;

module.exports = function(app) {

    app.post('/auth/users', auth.ensureAuthenticated, function (req, res, next) {
        var newUser = new User(req.body);
        newUser.provider = 'local';

        newUser.save(function (err) {
            if (err) {
                return next(err)
            } else {
                return res.json(200);
            }
        });
    });
    app.get('/auth/users/:userId', auth.ensureAuthenticated, function (req, res, next) {
        var userId = req.params.userId;

        User.findById(ObjectId(userId), function (err, user) {
            if (err) {
                return next(new Error('Failed to load User'));
            }
            if (user) {
                console.log(user);
                res.json(200, {username: user.username, email: user.email });
            } else {
                res.send(404, 'USER_NOT_FOUND')
            }
        });
    });

    app.get('/auth/check_username/:username', auth.ensureAuthenticated, function (req, res, next) {
        var username = req.params.username;
        User.findOne({ username: username }, function (err, user) {
            if (err) {
                return next(new Error('Failed to load User ' + username));
            }

            if (user) {
                res.json({exists: true});
            } else {
                res.json({exists: false});
            }
        });

    });

};
