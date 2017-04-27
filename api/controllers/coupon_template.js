"use strict";
/**
 用于处理优惠券模版
**/
var util = require("util");

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
    var couponTemplate = util.format('status:%s, type:%s, origin:%s', status, type, origin);
    console.log(couponTemplate);
    res.json(couponTemplate);
}

function createCouponTemplate(req, res){
}
