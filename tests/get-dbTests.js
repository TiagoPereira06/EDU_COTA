const assert = require('assert');
const services = require('../src/cota-services');

describe('GET All Groups', () => {
    it('Should return all Groups', done => {
        services.getAllGroups()
            .then(result => {
                    assert.notStrictEqual(result.data, undefined)
                    assert.strictEqual(result.short, services.RESOURCE_FOUND_MSG)
                    done();
                }
            )
    })
})

describe('GET Group By Name', () => {
    it('Should return non existing group', done => {
        services.getGroupByName('NonExistingGroup')
            .catch(result => {
                    assert.notStrictEqual(result.detail, undefined)
                    assert.strictEqual(result.short, services.RESOURCE_NOT_FOUND_MSG)
                    done();
                }
            )
    })
})