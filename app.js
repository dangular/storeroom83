var app = require('./server');
var config = require('./lib/configuration');

app.set('port', config.get("express:port"));

app.listen(app.get('port'), function(){
    console.log("Server listening on port "+ app.get('port'));
});

module.exports = app;
