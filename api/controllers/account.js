"use strict";
/**
 用于处理优惠券模版
**/
var util = require("util");
var DomainAccount = require("../models/data_define").DomainAccount;

module.exports = {
    loginAccount: loginAccount
};

/**
 * req: handle the request object
 * res: handle the response object
**/
function loginAccount(req, res){
    var login = req.swagger.params.account.value;
    DomainAccount
        .signInAccount(login)
        .then((accountInfo)=>{
            console.log(`accountInfo:${ JSON.stringify(accountInfo)}`);
            let info = JSON.parse(JSON.stringify(accountInfo));
            let accountOut = {};
            for(var key in info){
                if(info[key]){
                    console.log(`accountInfo.${key} : ${info[key]}`);
                    accountOut[key] = accountInfo[key];
                };
            }
            delete(accountOut.created_at);
            delete(accountOut.updated_at);
            res.status(200);
            let result = {
                code: 200,
                message:"ok",
                account: accountOut
            };
            accountOut.id = parseInt(accountOut.id);
            console.log(`account out: ${ JSON.stringify(accountOut)}`);
            res.json(result);
        });
}

