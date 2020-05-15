const util = require('./cota-utils.js')
const fetch = require ('node-fetch')
const {getErrObj} = require("./cota-utils");

function getPopularSeries(page) {
    return new Promise (function(resolve,reject) {
        const fetchPromise = fetch(`${util.API_URL_START}/3/tv/popular?api_key=${util.API_KEY}&language=${util.language}&page=${page}`)
        if(fetchPromise === null) reject(getErrObj(404))
        resolve(
            fetchPromise
                .then(response => response.json())
                .then(respJson => respJson.results.map(e => [{"name": e.original_name}]) )
        )

    })
}

function getSeriesWithId(id) {
    return new Promise (function(resolve,reject) {
        const fetchPromise = fetch(`${util.API_URL_START}/3/tv/${id}?api_key=${util.API_KEY}&language=${util.language}`)
        if(fetchPromise === null) reject(getErrObj(404))
        resolve(
            fetchPromise
                .then(response => response.json())
                .then(respJson => respJson.results)

        )
    })
}

function getSeriesWithName(name) {
    return new Promise (function(resolve,reject) {
        const fetchPromise = fetch(`${util.API_URL_START}/3/search/tv/?api_key=${util.API_KEY}&language=${util.language}&query=${name}`)
        if(fetchPromise === null) reject(getErrObj(404))
        resolve(
            fetchPromise
                .then(response => response.json())
                .then(respJson => respJson.results)
        )
    })
}

module.exports = {

    getPopularSeries: getPopularSeries,
    getSeriesWithId: getSeriesWithId,
    getSeriesWithName: getSeriesWithName
};