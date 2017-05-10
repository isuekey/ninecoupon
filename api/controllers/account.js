"use strict";
/**
 用于处理优惠券模版
**/
var util = require("util");
var DomainAccount = require("../models/data_define").DomainAccount;

module.exports = {
    loginAccount: loginAccount,
    createAccount: createAccount,
    anonymousAccount: anonymousAccount,
    getAccount
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
        res.json(result);
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

function createAccount(req, res){
    var account = req.swagger.params.account.value;
    let result = {
        code: 1100,
        message: "没有提供有效参数"
    };
    let available = account && account.account && account.password;
    if(!available) {
        res.json(result);
        return;
    };
    delete(account.id);
    DomainAccount.findReidsAccount(account)
        .then((user)=>{
            console.log(user);
            if(user){
                result = {
                    code: 1101,
                    message: "已经存在此用户"
                };
                
                res.json(result);
                console.log(result);
            }else{
                DomainAccount.signUpAccount(account)
                    .then((xxx)=>{
                        result = {
                            code: 0,
                            message: "成功注册"
                        };
                        res.json(result);
                    },(err)=>{
                        console.log(err);
                    });
            }
        });
}
function anonymousAccount(req, res){
    createAccount(req, res);
}
function getAccount(req, res){
    console.log(req);
}
