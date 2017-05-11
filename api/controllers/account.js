"use strict";
/**
 用于处理优惠券模版
**/
var util = require("util");
var DomainAccount = require("../models/data_define").DomainAccount;

module.exports = {
    createAccount: createAccount,
    anonymousAccount: anonymousAccount,
    getAccount
};

/**
 * req request
 * res response
 */
function createAccount(req, res){
    let account = req.body;
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
            if(user){
                result = {
                    code: 1101,
                    message: "已经存在此用户"
                };
                
                res.json(result);
            }else{
                DomainAccount.signUpAccount(account)
                    .then((xxx)=>{
                        result = {
                            code: 0,
                            message: "成功注册"
                        };
                        res.json(result);
                    },(err)=>{
                        res.json(err);
                    });
            }
        });
}
/**
 * anonymous account sign up
 * req body { account:string, password:string}
 * res 
 */
function anonymousAccount(req, res){
    createAccount(req, res);
}
/**
 * get account info by token
 */
function getAccount(req, res){
    let authUser = req.user;
    let result = {
        code: 1110,
        message: "没有找到用户"
    };
    
    if(authUser){
        DomainAccount
            .getAccountInfo(authUser)
            .then( (domainAccount)=>{
                res.status(200);
                res.json(domainAccount.toJSON());
            })
            .catch( (error) =>{
                res.json(error);
            });
    }else{
        res.status(500);
        res.json(result);
    }
}
