var should = require('should');
var request = require('supertest');
var server = require('../../../app');

describe('controllers', function() {
    describe('account', function(){
        describe('POST /account/signin', function(){
            it('should return default error', function(done){
                request(server)
                    .post('/account/signin')
                    .set('Accept', 'application/json')
                    .send({})
                    .expect(200)
                    .end((error, res)=>{
                        should.not.exist(error);
                        res.body.should.eql({
                            code: 1000,
                            message: "not give the correct params"
                        });
                        done();
                    });
            });
            it('should return not found error', function(done){
                request(server)
                    .post('/account/signin')
                    .set('Accept', 'application/json')
                    .send({account:'liuhanru', password:'sjskxclvjlsf#1sldkfui'})
                    .expect(200)
                    .end((error, res)=>{
                        should.not.exist(error);
                        res.body.should.eql({
                            code: 1001,
                            message: "not found the user"
                        });
                        done();
                    });
            });
            it('shoud return correct user', function(done){
                request(server)
                    .post('/account/signin')
                    .set('Accept', 'application/json')
                    .send({account:'liuhanru', password:'123456'})
                    .expect(200)
                    .end((error, res)=>{
                        should.not.exist(error);
                        res.body.should.have.property('code', 0);
                        res.body.should.have.property('message', 'found an active user');
                        res.body.should.have.property('token').which.is.a.String();
                        res.body.should.have.property('refresh').which.is.a.String();
                        res.body.should.have.property('effective', 30);
                        res.body.should.have.property('account');
                        res.body.should.have.property('account').which.have.property('id').which.is.a.Number();
                        res.body.should.have.property('account').which.have.property('account').which.is.a.String();
                        res.body.should.have.property('account').which.have.property('accountName').which.is.a.String();
                        res.body.should.have.property('account').which.have.property('phone').which.is.a.String();
                        res.body.should.have.property('account').which.have.property('gender').which.is.a.Number();
                        res.body.should.have.property('account').which.have.property('avatar').which.is.a.String();
                        res.body.should.have.property('account').which.have.property('status').which.is.a.String();
                        res.body.should.have.property('account').which.have.property('promoter').which.is.a.Number();
                        res.body.should.have.property('account').which.have.property('accountType').which.is.a.String();
                        res.body.should.have.property('account').which.have.property('created_at').which.is.a.String();
                        res.body.should.have.property('account').which.have.property('updated_at').which.is.a.String();
                        done();
                    });
            });
        });
    });


    // app.post('/', function(req, res){
    //   res.send(req.body.name);
    // });

    // request(app)
    // .post('/')
    // .send({ name: 'tobi' })
    // .expect('tobi', done);

  // describe('hello_world', function() {

  //   describe('GET /hello', function() {

  //     it('should return a default string', function(done) {

  //       request(server)
  //         .get('/hello')
  //         .set('Accept', 'application/json')
  //         .expect('Content-Type', /json/)
  //         .expect(200)
  //         .end(function(err, res) {
  //           should.not.exist(err);

  //           res.body.should.eql('Hello, stranger!');

  //           done();
  //         });
  //     });

  //     it('should accept a name parameter', function(done) {

  //       request(server)
  //         .get('/hello')
  //         .query({ name: 'Scott'})
  //         .set('Accept', 'application/json')
  //         .expect('Content-Type', /json/)
  //         .expect(200)
  //         .end(function(err, res) {
  //           should.not.exist(err);

  //           res.body.should.eql('Hello, Scott!');

  //           done();
  //         });
  //     });

  //   });

  // });

});