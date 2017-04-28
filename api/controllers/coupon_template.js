"use strict";
/**
 用于处理优惠券模版
**/
var util = require("util");
var DomainCouponTemplate = require("../models/data_define").DomainCouponTemplate;

module.exports = {
    getAllCouponTemplate: getAllCouponTemplate,
    createCouponTemplate: createCouponTemplate
};

/**
 * req: handle the request object
 * res: handle the response object
**/
function getAllCouponTemplate(req, res){
    var status = req.swagger.params.status.value;
    var type = req.swagger.params.type.value;
    var origin = req.swagger.params.origin.value;
    var templateList = DomainCouponTemplate.queryCouponTemplate(status, type, origin);
    res.json({templateList});
}

function createCouponTemplate(req, res){
}
