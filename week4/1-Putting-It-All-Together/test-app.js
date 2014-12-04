var server = require('./app'),
    assert = require('assert'),
    http = require('http');

var expect = require('chai').expect,
    supertest = require('supertest'),
    api = supertest('http://localhost:3000');

describe('app', function () {
    beforeEach(function () {
        server.listen(3000);
    });

    afterEach(function () {
        server.close();
    });
});

describe('POST /snippets', function () {
    it('should return ID', function (done) {
        api.post('/snippets')
            .set('Content-Type','application/json')
            .send(JSON.stringify({
                language: "javaScript",
                fileName: "test.js",
                creator: "ylin",
                code: "app.get(\"/p\", function(req, res) {\r\n  res.send(\"tagId is set to \" + req.param(\"tagId\"));\r\n});"
            }))
            .expect(200)
            .end(function(err, res){
                if(err) {
                    done(err);
                } else {
                    expect(res.body).to.be.a('string');
                    done();
                }
            });
    });
});

describe('GET /snippets', function () {
    it('should return 200', function (done) {
        http.get('http://localhost:3000/snippets', function (res) {
            assert.equal(200, res.statusCode);
            done();
        });
    });

    it('should return array with JSON', function (done) {
        http.get('http://localhost:3000/snippets', function (res) {
            var data = '';

            res.on('data', function (chunk) {
                data += chunk;
            });

            res.on('end', function () {
                var response = JSON.parse(data);
                expect(response).to.be.a('array');

                for(var obj in response ){
                    expect(response[obj]).to.be.an('object');
                }

                done();
            });
        });
    });
});
