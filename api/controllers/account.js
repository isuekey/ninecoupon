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
    let result = {
        code: 1000,
        message: "not give the correct params"
    };
    if(!login || !(login.account || login.password)){
        res.status(200);
        res.json(result)
        return;
    };
    DomainAccount
        .signInAccount(login)
        .then((accountInfo)=>{
            res.status(200);
            if(accountInfo){
                let info = JSON.parse(JSON.stringify(accountInfo));
                let accountOut = {};
                for(var key in info){
                    if(info[key]){
                        accountOut[key] = accountInfo[key];
                    };
                }
                accountOut.id = parseInt(accountOut.id);
                result = {
                    code: 0,
                    account: accountOut,
                    message: 'found an active user',
                    token:'token',
                    refresh:'refresh_token',
                    effective: 30
                };
            }else{
                result = {
                    code: 1001,
                    message: "not found the user"
                };
            };
            res.json(result);
        }, (error)=>{
            console.log(`request:${req} \n response:${res}`);
        });
}

