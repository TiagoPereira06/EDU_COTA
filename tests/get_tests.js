const request  = require('request');
const assert = require('assert');
const utils = require('../src/cota-utils.js');



describe('GET Specific Series', function() {
    this.timeout(utils.MOCHA_TIMEOUT)

    const options = utils.requestServerOptions('GET', 'series/Homeland', null)
    it('Should return Homeland with the status code \'200 OK\'', function(done) {
        request.get(options, (err, res, body) => {
            series = body
            assert.equal(series.results.name, "Homeland")
            assert.equal(res.statusCode, 200)
            done()
        })
    });
});
describe('GET Popular Series', function() {
    this.timeout(utils.MOCHA_TIMEOUT)

    const options = utils.requestServerOptions('GET', 'series/popular/1', null)
    it('Should return 20 series with the status code \'200 OK\' for page 1', function(done) {
        request.get(options, (err, res, body) => {
            series = body
            assert.equal(series.results.length, 20)
            assert.equal(res.statusCode, 200)
            done()
        })
    });
});