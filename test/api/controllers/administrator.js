var should = require("should");
var request = require("supertest");
var server = require("../../../app");

var requestToken = require("./account").requestToken;
var token = {};
describe("controllers", () => {
    let account = {
        account: "admin",
        password: "123456"
    };
    describe("测试管理接口，登录获得有效的token", ()=>{
        it("should reqeust token", (done)=>{
            requestToken(done, account.account, account.password, token)();
            token.should.not.have.property('access_token');
            token.should.not.have.property('expires_in');
            token.should.not.have.property('refresh_token');
            token.should.not.have.property('token_type', 'bearer');
        });
        it("已经获取了token", (done)=>{
            token.should.have.property('access_token');
            token.should.have.property('expires_in');
            token.should.have.property('refresh_token');
            token.should.have.property('token_type', 'bearer');
            done();
        });
    });
    describe("administrator", ()=>{
        describe("/ninecoupon/area/list 查询区域列表默认返回100条数据", ()=>{
            let areaListPathBase = "/ninecoupon/area/list";
            it('should get area list default', (done)=>{
                request(server)
                    .get(areaListPathBase)
                    .set('Accept', 'application/json')
                    .set("Authorization", `Bearer ${token.access_token}`)
                    .expect(200)
                    .end((error, res)=>{
                        should.not.exist(error);
                        res.body.should.have.property('length').which.is.a.Number().and.be.belowOrEqual(100);
                        res.body.should.be.an.Array();
                        res.body.forEach((ele)=>{
                            ele.should.have.property('id');
                            let id = parseInt(ele.id);
                            id.should.be.a.Number();
                            ele.should.have.property('name');
                            ele.should.have.property('areaIndex');
                            ele.should.have.property('status').and.not.be.null();
                            ele.should.have.property('latitude');
                            ele.should.have.property('longitude');
                            ele.should.have.property('created_at').and.not.be.null();
                            ele.should.have.property('updated_at');
                        });
                        done();
                    });
            });
        });
        describe("/ninecoupon/area 新建区域", ()=>{
            let newAreaPath = "/ninecoupon/area";
            let random = Math.floor(Math.random() * 100000);
            let newArea = {
                name:`测试区域${random}`,
                areaIndex:`test${random}`,
                status:"enabled",
                latitude: 38.335577,
                longitude: 116.158723
            };
            it('should create new area', (done)=>{
                request(server)
                    .post(newAreaPath)
                    .set('Accept', 'application/json')
                    .set("Authorization", `Bearer ${token.access_token}`)
                    .send({})
                    .expect(200)
                    .end((error, res)=>{
                        done();
                    });
            });
        });
    });
});
