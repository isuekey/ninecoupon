"use strict";

var util = require("util");
var DomainAccount = require("../models/data_define").DomainAccount;
var DomainCouponStrategyAccess = require("../models/data_define").DomainCouponStrategyAccess;
var DomainCouponTemplate = require("../models/data_define").DomainCouponTemplate;
var DomainShop = require("../models/data_define").DomainShop;
var Domaincouponinstance = require("../models/data_define").Domaincouponinstance;
var DomainArea = require("../models/data_define").DomainArea;

module.exports = {
    queryStrategyList,
    queryMyShopList,    
    queryDefaultShopStrategyList,
    generateTemplateByStrategy,
    queryShopTemplateList,
    publishShopTemplate,
    queryUserCoupon,
    randomAreaCoupon,
    receiveCoupon
};

/**
 * 获得用户店面下的策略列表
 */
function queryStrategyList(req, res){
};

function queryMyShopList(req, res){
    let authUser = req.user;
    DomainShop.queryMyShopList(authUser).then((arrayJson)=>{
        res.json(arrayJson);
    }).catch((error)=>{
        res.status(500);
        res.json({
            code: 1500,
            message: "找不到授权模版"
        });
    });
};

/**
 * 获得用户店面下的策略列表
 */
function queryDefaultShopStrategyList(req, res){
    let authUser = req.user;
    if(!authUser) return;
    DomainCouponStrategyAccess.queryStrategyAccessed(authUser)
        .then( (arrayJson)=>{
            res.status(200);
            res.json(arrayJson);
        })
        .catch( (error)=>{
            res.status(500);
            res.json({
                code: 1200,
                message: "找不到授权模版"
            });
        });
};

function generateTemplateByStrategy(req, res){
    let authUser = req.user;
    let accessStrategy = req.body;
    DomainCouponTemplate.generateTemplateByStrategy(authUser, accessStrategy) .then( (arrayJson, created) =>{
        res.status(200);
        res.json(arrayJson);
    }).catch( (error)=>{
        res.status(500);
        res.json({
            code: 1200,
            message: "找不到授权模版"
        });
    });
};

function queryShopTemplateList(req, res){
    let authUser = req.user;
    let shopId = req.params.shopId;
    DomainCouponTemplate.queryShopTemplateList(authUser, shopId).then((arrayJson) =>{
        res.json(arrayJson);
    }).catch( (error)=>{
        res.status(500);
        res.json({
            code: 1200,
            message: "找不到授权模版"
        });
    });
};

function publishShopTemplate(req, res){
    let authUser = req.user;
    let templateId = req.params.templateId;
    DomainCouponTemplate.publishShopTemplate(authUser, templateId).then( (counted, rowJson) =>{
        res.json(rowJson);
    }).catch( (error)=>{
        res.status(500);
        res.json({
            code: 1200,
            message: "找不到授权模版"
        });
    });
};

function queryUserCoupon(req, res){
    let authUser = req.user;
    Domaincouponinstance.queryUserCoupon(authUser).then( (arrayJson) =>{
        res.json(arrayJson);
    }).catch( (error)=>{
        res.status(500);
        res.json({
            code: 1300,
            message: "系统错误"
        });
    });
};

function randomAreaCoupon(req, res){
    let authUser = req.user;
    let areaId = req.params.areaId;
    DomainArea.randomAreaCoupon(authUser, areaId).then( arrayJson =>{
        res.json(arrayJson);
    }).catch( (error)=>{
        res.status(500);
        res.json({
            code: 1300,
            message: "系统错误"
        });
    });
};

function receiveCoupon(req, res){
    let authUser = req.user;
    let couponTemplate = req.body;
    Domaincouponinstance.generateCouponFromTemplate(authUser, couponTemplate).then((arrayJson, created)=>{
        res.json(arrayJson[0]);
    }).catch( (error)=>{
        res.status(500);
        res.json({
            code: 1300,
            message: "系统错误"
        });
    });
};
