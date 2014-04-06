var app = require('./server'),
    config = require('./lib/configuration'),
    db = require('./lib/model/db'),
    fs = require('fs');

app.set('port', config.get("express:port"));

// winston won't create directory, create the logging path if it doesn't exist
fs.exists(config.get("logger:path"), function(exists) {
    if (!exists) {
        fs.mkdir(config.get("logger:path"), function(err) {
            if (err) throw err;
            console.log("Created path for logger: "+config.get("logger:path"));
        });
    }
});


app.listen(app.get('port'), function(){
    console.log("Server listening on port "+ app.get('port'));
});

module.exports = app;
