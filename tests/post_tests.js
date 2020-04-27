const request  = require('request');
const assert = require('assert');
const utils = require('../src/cota-utils.js');



describe('POST Group', function() {
    this.timeout(utils.MOCHA_TIMEOUT)

    const options = utils.requestServerOptions('POST', 'groups', {
        "name" : "Comedy",
        "desc" : "Comedy Tv Shows"
    })
    it('Should return Success with the status code \'201 CREATED\'', function(done) {
        request.post(options, (err, res, body) => {
            assert.equal(body.toString(), "Group created successfully")
            assert.equal(res.statusCode, 201)
            done()
        })
    });
});

describe('POST Duplicate Group', function() {
    this.timeout(utils.MOCHA_TIMEOUT)

    const options = utils.requestServerOptions('POST', 'groups', {
        "name" : "Comedy",
        "desc" : "Comedy Tv Shows"
    })
    it('Should return Error with the status code \'403 FORBIDDEN \'', function(done) {
        request.post(options, (err, res, body) => {
            assert.equal(body.error.toString(), "Group already exists")
            assert.equal(res.statusCode, 403)
            done()
        })
    });
});