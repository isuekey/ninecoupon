'use strict';
var express = require('express'),
    bodyParser = require('body-parser'),
    oauthserver = require('oauth2-server'); // Would be: 'oauth2-server'

var controllerAccount = require('./api/controllers/account');
var controllerConsumption = require('./api/controllers/consumption');
var controllerCoupon = require('./api/controllers/coupon');

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.oauth = oauthserver({
    model: require('./api/models/oauth2.model'),
    grants: ['password', 'refresh_token'],
    debug: true
});

app.all('/*', function(req, res, next){
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "X-Requested-With");
   res.header("Access-Control-Allow-Methods", "GET, POST","PUT");
   next();
});

// Handle token grant requests
app.all('/oauth/token', app.oauth.grant());

app.post('/ninecoupon/signup', controllerAccount.createAccount);
app.post('/ninecoupon/anonymous', controllerAccount.anonymousAccount);
app.get('/ninecoupon/account', app.oauth.authorise(), controllerAccount.getAccount);

app.get('/consumption/clerk/list',app.oauth.authorise(), controllerConsumption.queryMyClerkList);
app.get('/consumption/shop/:shopId/clerk/list',app.oauth.authorise(), controllerConsumption.queryMyClerkListInTheShop);
app.delete('/consumption/clerk/:clerkId', app.oauth.authorise(), controllerConsumption.deleteMyClerk);
app.post("/consumption/clerk", app.oauth.authorise(), controllerConsumption.addMyClerk);
app.get("/consumption/shop/:shopId/writeoff/list", app.oauth.authorise(), controllerConsumption.queryMyWriteOffInTheShop);
app.post("/consumption/writeoff/coupon", app.oauth.authorise(), controllerConsumption.writeOffCoupon);

app.get("/ninecoupon/shop/list", app.oauth.authorise(), controllerCoupon.queryMyShopList);
app.get("/ninecoupon/shop/work/list", app.oauth.authorise(), controllerCoupon.queryMyShopWorkList);
app.get("/ninecoupon/shop/:shopId/strategy/list", app.oauth.authorise(), controllerCoupon.queryShopStrategyList);
app.get("/ninecoupon/strategy/list", app.oauth.authorise(), controllerCoupon.queryStrategyList);
app.post("/ninecoupon/strategy", app.oauth.authorise(), controllerCoupon.addNewStrategy);
app.post("/ninecoupon/strategy/access", app.oauth.authorise(), controllerCoupon.addNewStrategyAccess);
app.post("/ninecoupon/template/create", app.oauth.authorise(), controllerCoupon.generateTemplateByStrategy);
app.get("/ninecoupon/shop/:shopId/template/list", app.oauth.authorise(), controllerCoupon.queryShopTemplateList);
app.put("/ninecoupon/template/:templateId/publish", app.oauth.authorise(), controllerCoupon.publishShopTemplate);
app.get("/ninecoupon/coupon/list", app.oauth.authorise(), controllerCoupon.queryUserCoupon);
app.get("/ninecoupon/coupon/wifi/:areaIndex", controllerCoupon.randomAreaCoupon);
app.post("/ninecoupon/coupon", app.oauth.authorise(), controllerCoupon.receiveCoupon);

app.get('/ninecoupon/area/list', app.oauth.authorise(), controllerCoupon.queryAreaList);
app.post('/ninecoupon/area', app.oauth.authorise(), controllerCoupon.addNewArea);
app.get('/ninecoupon/area/:areaIndex/shop/list', app.oauth.authorise(), controllerCoupon.queryShopOfTheArea);
app.post('/ninecoupon/area/:areaIndex/shop', app.oauth.authorise(), controllerCoupon.addNewShopOfTheArea);

app.get('/oauth/authorise', app.oauth.authorise(), function (req, res) {
    // Will require a valid access_token
    res.send('Secret area');
});

app.get('/public', function (req, res) {
  // Does not require an access_token
  res.send('Public area');
});


app.use(app.oauth.errorHandler());

var port = process.env.PORT || 10010;
app.listen(port);


/**
*** TODO ninecoupon/strategy/list
*** TODO ninecoupon/template/create
*** TODO ninecoupon/template/list
*** TODO ninecoupon/template/publish
*** TODO ninecoupon/coupon/list
*** TODO ninecoupon/coupon/wifi
*** TODO ninecoupon/coupon
*** TODO consumption/list
*** TODO consumption/coupon

 */
