/**
 * Created by: dhayes on 4/4/14.
 * Filename: server
 */
var express = require('express'),
    http = require('http'),
    passport = require('passport'),
    path = require('path'),
    fs = require('fs'),
    mongoStore = require('connect-mongo')(express),
    config = require('./lib/configuration');

var app = express();

require('./lib/db/mongo');

// Bootstrap models
var modelsPath = path.join(__dirname, 'lib/models');
fs.readdirSync(modelsPath).forEach(function (file) {
    require(modelsPath + '/' + file);
});

// Passport configuration
require('./lib/configuration/pass');

// cookieParser should be above session
app.use(express.cookieParser());

// all environments
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(express.favicon());
app.use(express.logger({intermediate: true, format: 'dev'}));
app.use(express.json());
app.use(express.urlencoded());

// development only
app.configure('development', function(){
    app.use(express.errorHandler());
});

// cookieParser should be above session
app.use(express.cookieParser());

app.use(express.methodOverride());

// express/mongo session storage
app.use(express.session({
    secret: 'dangular',
    store: new mongoStore({
        url: config.get('mongodb:dbURI'),
        collection: 'sessions'
    })
}));

//use passport session
app.use(passport.initialize());
app.use(passport.session());

app.use(app.router);

/**
 * Routes
 */

var renderIndex = function(req, res) {
    res.render('index');
};

app.get('/', renderIndex);
app.get('/partials/*', function(req, res) {
    var requestedView = path.join('./', req.url);
    res.render(requestedView);
});

require('./lib/routes')(app);

// redirect all others to the index (HTML5 history)
app.get('*', renderIndex);

app.set('port', config.get("express:port"));

// winston won't create directory, create the logging path if it doesn't exist
if (!fs.existsSync(config.get('logger:path'))) {
    fs.mkdirSync(config.get('logger:path'));
}

if (config.get('logger:truncateOnStart')) {
    var fullPath = path.join(config.get('logger:path'), config.get('logger:filename'));
    if (fs.existsSync(fullPath)) {
        fs.truncateSync(fullPath);
    }
}

app.listen(app.get('port'), function(){
    console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;


