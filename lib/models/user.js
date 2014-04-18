/**
 * Created by: dhayes on 4/16/14.
 * Filename: user
 */
'use strict';

var mongoose = require('mongoose'),
    crypto = require('crypto'),
    merge = require('mongoose-merge-plugin'),
    timestamp = require('mongoose-timestamp');

mongoose.plugin(merge);

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    hashedPassword: String,
    salt: String,
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    roles: [String],
    provider: String
});

UserSchema.plugin(timestamp);

/**
 * Virtuals
 */
UserSchema
    .virtual('password')
    .set(function(password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function() {
        return this._password;
    });

UserSchema
    .virtual('user_info')
    .get(function () {
        return { '_id': this._id, 'username': this.username, 'email': this.email, 'firstName': this.firstName, 'lastName': this.lastName, 'roles': this.roles };
    });

/**
 * Validations
 */

var validatePresenceOf = function (value) {
    return value && value.length;
};

UserSchema.path('email').validate(function (email) {
    var emailRegex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    return emailRegex.test(email);
}, 'The specified email is invalid.');

UserSchema.path('email').validate(function(value, respond) {
    mongoose.models["User"].findOne({email: value}, function(err, user) {
        if(err) throw err;
        if(user) return respond(false);
        respond(true);
    });
}, 'The specified email address is already in use.');

UserSchema.path('username').validate(function(value, respond) {
    mongoose.models["User"].findOne({username: value}, function(err, user) {
        if(err) throw err;
        if(user) return respond(false);
        respond(true);
    });
}, 'The specified username is already in use.');

/**
 * Pre-save hook
 */

UserSchema.pre('save', function(next) {
    if (!this.isNew) {
        return next();
    }

    if (!validatePresenceOf(this.password)) {
        next(new Error('Invalid password'));
    }
    else {
        next();
    }
});

/**
 * Methods
 */

UserSchema.methods = {

    /**
     * Authenticate - check if the passwords are the same
     */

    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashedPassword;
    },

    /**
     * Make salt
     */

    makeSalt: function() {
        return crypto.randomBytes(16).toString('base64');
    },

    /**
     * Encrypt password
     */

    encryptPassword: function(password) {
        if (!password || !this.salt) return '';
        var salt = new Buffer(this.salt, 'base64');
        return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
    }
};

mongoose.model('User', UserSchema);