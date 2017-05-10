'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
module.exports = app; // for testing
var oauthServer = require('oauth2-server');
var securityHandler = {
    nineauth: function (req, def, scopes, callback) {
        console.log("req");
        console.log(req);
        console.log("def");
        console.log(def);
        console.log("scopes");
        console.log(scopes);
        console.log("callback");
        console.log(callback);
        console.log(callback.prototype);
    }
};

var config = {
    appRoot: __dirname, // required config
    swaggerSecurityHandlers: securityHandler
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
    if (err) { throw err; }
    
    // install middleware
    swaggerExpress.register(app);
    var port = process.env.PORT || 10010;
    app.listen(port);
});
