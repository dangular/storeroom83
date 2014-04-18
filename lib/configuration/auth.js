/**
 * Created by: dhayes on 4/16/14.
 * Filename: auth
 */
'use strict';

/**
 *  Route middleware to ensure user is authenticated.
 */
exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.send(401);
};