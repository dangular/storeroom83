var config = require('./lib/configuration'),
    fs = require('fs'),
    path = require('path'),
    app = require('./server');

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
    console.log("Server listening on port "+ app.get('port'));
});

module.exports = app;
