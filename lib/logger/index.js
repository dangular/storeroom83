/**
 * Created by: dhayes on 4/5/14.
 * Filename: index
 */
var winston = require('winston'),
    config = require('../configuration'),
    path = require('path');

function Logger(){
    return winston.add(winston.transports.File, {
        filename: path.join(config.get('logger:path'), config.get('logger:filename')),
        maxsize: 1048576,
        maxFiles: 3,
        level: config.get('logger:level')
    });
}
module.exports = new Logger();