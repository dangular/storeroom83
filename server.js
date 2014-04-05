/**
 * Created by: dhayes on 4/4/14.
 * Filename: server
 */
var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    path = require('path');

var app = express();

/**
 * Configuration
 */

// all environments
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger({intermediate: true, format: 'dev'}));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(app.router);

// development only
if (app.get('env') === 'development') {
    app.use(express.errorHandler());
}

// production only
if (app.get('env') === 'production') {
    // TODO
}


/**
 * Routes
 */

// serve index and view partials
app.get('/', routes.index);
app.get('/partials/:module/:partial', routes.partials);
app.get('/heartbeat', routes.heartbeat);
app.get('/healthCheck', routes.healthCheck);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

module.exports = app;

