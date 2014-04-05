/**
 * Created by: dhayes on 4/5/14.
 * Filename: index.js
 */
var nconf = require('nconf');

function Config() {
    nconf.argv().env("_");
    var environment = nconf.get("NODE:ENV") || "development";
    nconf.file(environment, "config/" + environment + ".json");
    nconf.file("default", "config/default.json");

    this.get = function(key) {
        return nconf.get(key);
    }
}

module.exports = new Config();

