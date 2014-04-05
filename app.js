var app = require('./server');

app.set('port', process.env['PORT'] || 3000);

app.listen(app.get('port'), function(){
    console.log("Server listening on port "+ app.get('port'));
});

module.exports = app;
