
/**
 * Module dependencies.
 */
var redis = require('redis').createClient();
var bluebird = require('bluebird');

var db = bluebird.promisifyAll(redis);
var fmt = require('util').format;
var DomainAccount = require("./data_define").DomainAccount;
/**
 * Redis formats.
 */

var formats = {
    token: 'tokens',
    client: 'clients',
    refreshToken: 'refresh_tokens:%s',
    grantTypes: 'grant_types',
    user: 'users'
};

var formatString = (key, info,appendex) =>{
    return `${key}:${info}${appendex?":"+appendex: ""}`;
};

/**
 * Get client.
 */
module.exports.getClient = function(clientId, clientSecret) {
    return db.hgetall(formatString(formats.client, clientId))
        .then(function(client) {
            let validClient = !client || client.clientSecret !== clientSecret;
            let result = validClient ? {
                clientId: client.clientId,
                clientSecret: client.clientSecret
            } : undefined;
            return result;
        });
};

/**
 * has it the authorizing type
 * init: sadd "client:${clientId}:grant_types" "${grantType}"
 */
module.exports.grantTypeAllowed = function(clientId, grantType){
    return db.sismember(formatString(formats.client, clientId, formats.grantTypes), grantType);
};

/**
 * Get user.
 */
module.exports.getUser = function(username, password) {
    return db.hgetall(formatString(formats.user, username))
        .then(function(user) {
            let validUser =  (!user || password !== user.password) ;
            return validUser ? { id: username } : undefined;
        });
};

/**
 * save access token
 */
module.exports.saveAccessToken = function(accessToken, clientId, expires, user){
    let mapping = {
        accessToken, clientId, userId:user.id
    };
    if(expires){
        mapping.expires = expires.toISOString();
    };
    return db.hmset(formatString(formats.otken, accessToken), mapping);
};
/**
 * save refresh token
 */
module.exports.saveRefreshToken = function (refreshToken, clientId, expires, user, callback) {
    let mapping = {
        refreshToken, clientId, userId:user.id
    };
    if(expires){
        mapping.expires = expires.toISOString();
    };
    return db.hmset(formatString(formats.otken, refreshToken), mapping);
};

/**
 * Get access token.
 */
module.exports.getAccessToken = function(bearerToken) {
    return db.hgetall(fmt(formats.token, bearerToken))
        .then(function(token) {
            let result = undefined;
            if(token){
                result = {
                    accessToken: token.accessToken,
                    clientId: token.clientId,
                    expires: token.accessTokenExpiresOn,
                    userId: token.userId
                };
            };
            return result;
        });
};

/**
 * Get refresh token.
 */
module.exports.getRefreshToken = function(bearerToken) {
    return db.hgetall(fmt(formats.token, bearerToken))
        .then(function(token) {
            let result = !!token ? {
                clientId: token.clientId,
                expires: token.refreshTokenExpiresOn,
                refreshToken: token.accessToken,
                userId: token.userId
            } : undefined;
            return result;
        });
};

/**
 * Save token.
 */
module.exports.saveToken = function(token, client, user) {
    var data = {
        accessToken: token.accessToken,
        accessTokenExpiresAt: token.accessTokenExpiresAt,
        clientId: client.id,
        refreshToken: token.refreshToken,
        refreshTokenExpiresAt: token.refreshTokenExpiresAt,
        userId: user.id
    };

    return Promise.all([
        db.hmset(fmt(formats.token, token.accessToken), data),
        db.hmset(fmt(formats.token, token.refreshToken), data)
    ]).return(data);
};
