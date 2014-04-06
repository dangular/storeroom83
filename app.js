var app = require('./server'),
    config = require('./lib/configuration'),
    db = require('./lib/model/db');

app.set('port', config.get("express:port"));

app.listen(app.get('port'), function(){
    console.log("Server listening on port "+ app.get('port'));
});

module.exports = app;
