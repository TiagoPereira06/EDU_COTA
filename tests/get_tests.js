const request  = require('request')
const assert = require('assert')
const utils = require('./../cota-utils.js')


describe('GET Popular Series', function() {
    this.timeout(utils.MOCHA_TIMEOUT)

    const options = utils.requestServerOptions('GET', 'series/popular', null)
    it('Should return series with the status code \'200 OK\'', function(done) {
        request.get(options, (err, res, body) => {
            series = body
            assert.equal(series.length, 30)
            assert.equal(res.statusCode, 200)
            done()
        })
    });
});
