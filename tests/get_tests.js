const request  = require('request');
const assert = require('assert');
const utils = require('../src/cota-utils.js');


const optionsCreateGroupA = utils.requestServerOptions('POST', 'groups', {
    name: "A",
    desc: "Grupo de testes A"
})

describe('GET Specific Series', function() {
    this.timeout(utils.MOCHA_TIMEOUT)

    const options = utils.requestServerOptions('GET', 'series/Homeland', null)
    it('Should return Homeland with the status code \'200 OK\'', function(done) {
        request.get(options, (err, res, body) => {
            series = JSON.parse(body)
            assert.equal(series.results.name, "Homeland")
            assert.equal(res.statusCode, 200)
            done()
        })
    });
});