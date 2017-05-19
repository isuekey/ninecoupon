var should = require('should');
var request = require('supertest');
var server = require('../../../app');


var token = {}, oldtoken, expiredToken ='320cc983862d470254e81bf08639cdaf8afdabc9';
let username = 'liuhanru', password="123456", grantPassword="password";
let passwordForm = [["username",username], ["password", password], ["grant_type", grantPassword]].map((ele)=> ele.join("=")).join("&");

 let requestToken = (done, username, password, token)=>{
    return ()=>{
        request(server)
            .post("/oauth/token/")
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .set("Authorization", "Basic bmluZWNvdXBvbkFkbWluOmM5NjU0MTk5MzY2OTg1")
            .send({
                username, password,
                "grant_type":grantPassword
            })
            .expect(200)
            .end((error, res)=>{
                should.not.exist(error);
                res.body.should.have.property('access_token');
                res.body.should.have.property('expires_in');
                res.body.should.have.property('refresh_token');
                res.body.should.have.property('token_type', 'bearer');
                for(var key in res.body){
                    token[key] = res.body[key];
                }
                done();
            });
    };
 };

//关于token实际上不需要太多的测试，有oauth2-server提供相应的支持

describe('controllers', () => {
    describe('account', () => {
        let newAccount = "test0002";
        let newPassword = "1234567";
        let testPath = "/oauth/token/";
        describe(`token相关 ${testPath}`, ()=>{
            it('should return correct token', (done) =>{
                requestToken(done, username, password, token)();
            });
            it('should refresh token currectly', (done)=>{
                request(server)
                    .post('/oauth/token')
                    .set('Content-Type', 'application/x-www-form-urlencoded')
                    .set("Authorization", "Basic bmluZWNvdXBvbkFkbWluOmM5NjU0MTk5MzY2OTg1")
                    .send({"grant_type":"refresh_token", "refresh_token":token.refresh_token})
                    .expect(200)
                    .end((error, res)=>{
                        should.not.exist(error);
                        res.body.should.have.property('access_token');
                        res.body.should.have.property('expires_in');
                        res.body.should.have.property('refresh_token');
                        res.body.should.have.property('token_type', 'bearer');
                        oldtoken = token;
                        token = res.body;
                        done();
                    });
            });
        });
        let testAccountPath = "/ninecoupon/account";
        describe(`账号信息相关 ${testAccountPath}`, ()=>{
            it('shoud return correct user', (done)=>{
                request(server)
                    .get('/ninecoupon/account')
                    .set('Accept', 'application/json')
                    .set("Authorization", `Bearer ${token.access_token}`)
                    .expect(200)
                    .end((error, res)=>{
                        should.not.exist(error);
                        res.body.should.have.property("id");
                        let accountId = parseInt(res.body.id);
                        accountId.should.is.a.Number();
                        res.body.should.have.property("account").which.is.a.String();
                        res.body.should.have.property("accountName");
                        res.body.should.have.property("phone");
                        res.body.should.have.property("gender");
                        res.body.should.have.property("avatar");
                        res.body.should.have.property("password").which.is.a.String();
                        res.body.should.have.property("createAt");
                        res.body.should.have.property("status");
                        res.body.should.have.property("promoter");
                        res.body.should.have.property("accountType");
                        res.body.should.have.property("created_at").which.is.a.String();
                        res.body.should.have.property("updated_at");
                        done();
                    });
            });
            it('shoud return 401 授权失败', (done)=>{
                request(server)
                    .get('/ninecoupon/account')
                    .set('Accept', 'application/json')
                    .set("Authorization", `Bearer ${expiredToken}`)
                    .expect(401)
                    .end((error, res)=>{
                        should.not.exist(error);
                        res.body.should.have.property("code", 401);
                        res.body.should.have.property("error", 'invalid_token');
                        res.body.should.have.property("error_description");
                        done();
                    });
            });
        });
        let testAccountSingup = "/ninecoupon/signup";
        describe(`注册账号需要的信息`, ()=>{
            let testToken = {};
            it('should 1100 缺少参数 ', (done) =>{
                request(server)
                    .post(testAccountSingup)
                    .set('Accept', 'application/json')
                    .send({
                        account:newAccount
                    })
                    .expect(200)
                    .end((error, res)=>{
                        should.not.exist(error);
                        res.body.should.have.property("code", 1100);
                        res.body.should.have.property("message");
                        done();
                    });
            });
            it('should return 0 创建成功 ', (done) =>{
                request(server)
                    .post(testAccountSingup)
                    .set('Accept', 'application/json')
                    .send({
                        account:newAccount,
                        password:newPassword
                    })
                    .expect(200)
                    .end((error, res)=>{
                        should.not.exist(error);
                        res.body.should.have.property("code", 0);
                        res.body.should.have.property("message");
                        done();
                    });
            });
            it('should return 1101 已经创建用户 ', (done) =>{
                request(server)
                    .post(testAccountSingup)
                    .set('Accept', 'application/json')
                    .send({
                        account:newAccount,
                        password:newPassword
                    })
                    .expect(200)
                    .end((error, res)=>{
                        should.not.exist(error);
                        res.body.should.have.property("code", 1101);
                        res.body.should.have.property("message",'已经存在此用户');
                        done();
                    });
            });
            it('should get token', (done) =>{
                requestToken(done, newAccount, newPassword, testToken)();
            });
            it('could get the user info with new token', (done)=>{
                request(server)
                    .get('/ninecoupon/account')
                    .set('Accept', 'application/json')
                    .set("Authorization", `Bearer ${testToken.access_token}`)
                    .expect(200)
                    .end((error, res)=>{
                        should.not.exist(error);
                        res.body.should.have.property("id");
                        let accountId = parseInt(res.body.id);
                        accountId.should.is.a.Number();
                        res.body.should.have.property("account").which.is.a.String();
                        res.body.should.have.property("accountName");
                        res.body.should.have.property("phone");
                        res.body.should.have.property("gender");
                        res.body.should.have.property("avatar");
                        res.body.should.have.property("password").which.is.a.String();
                        res.body.should.have.property("createAt");
                        res.body.should.have.property("status");
                        res.body.should.have.property("promoter");
                        res.body.should.have.property("accountType");
                        res.body.should.have.property("created_at").which.is.a.String();
                        res.body.should.have.property("updated_at");
                        console.log(res.body);
                        done();
                    });
            });
            it(`should 1102 删除用户时权限不足`, (done)=>{
                request(server)
                    .delete(`/ninecoupon/account/${newAccount}`)
                    .set('Accept', 'application/json')
                    .set("Authorization", `Bearer ${testToken.access_token}`)
                    .expect(200)
                    .end((error, res)=>{
                        should.not.exist(error);
                        res.body.should.have.property("code", 1102);
                        res.body.should.have.property("message");
                        res.body.should.have.property("account", newAccount);
                        done();
                    });
            });
        });
        describe(`删除账号`, (done)=>{
            let adminToken = {};
            it(`get admin token`, (done)=>{
                requestToken(done, 'admin', '123456', adminToken)();
            });
            it(`should delte user ${newAccount}`, (done)=>{
                request(server)
                    .delete(`/ninecoupon/account/${newAccount}`)
                    .set('Accept', 'application/json')
                    .set("Authorization", `Bearer ${adminToken.access_token}`)
                    .expect(200)
                    .end((error, res)=>{
                        should.not.exist(error);
                        res.body.should.have.property("code", 0);
                        res.body.should.have.property("message");
                        res.body.should.have.property("account", newAccount);
                        res.body.should.have.property('deleted').which.is.a.Number();
                        done();
                    });
            });
        });
    });
});

module.exports = {
    requestToken
};
