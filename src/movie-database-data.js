const util = require('./cota-utils.js')
const request = require('request');
const fetch = require ('node-fetch')
const {getErrObj} = require("./cota-utils");

function getPopularSeries(page) {
       return new Promise (function(resolve,reject){
        const fetchPromise = fetch('https://api.themoviedb.org/3/tv/popular?api_key=0c9b2502c13f4dcc2217113f2adf3788&language=en-US&page='+page)
        if(fetchPromise === null) reject(getErrObj(404))
        resolve(
            fetchPromise
            .then(response => response.json())
            .then(respJson => respJson.results.map(e => [{"name": e.original_name}]) )
            )

       })
}


   /* const options = {
        'method': 'GET',
        'uri': `${util.API_URL_START}/3/tv/popular?api_key=${util.API_KEY}&language=${util.language}&page=${page}`,
    };
    request.get(options, (err, res, body) => {
        if (err == null) {
            popularSeriesObj = JSON.parse(body);

            processGetPopularSeries(null, popularSeriesObj.results.map(e => [{"name": e.original_name,}])) // All series name

        }
    });

    */


function getSeriesWithId(id, processGetSeriesWithId) {

    const options = {
        'method': 'GET',
        'uri': `${util.API_URL_START}/3/tv/${id}?api_key=${util.API_KEY}&language=${util.language}`,
    };
    request.get(options, (err, res, body) => {
        if (err == null) {
            seriesDetails = JSON.parse(body)
            processGetSeriesWithId(null, seriesDetails)

        }
    })

}

function getSeriesWithName(name, processGetSeriesWithName) {
    const options = {
        'method': 'GET',
        'uri': `${util.API_URL_START}/3/search/tv/?api_key=${util.API_KEY}&language=${util.language}&query=${name}`,
    };
    request.get(options, (err, res, body) => {
        if (err == null) {
            seriesDetails = JSON.parse(body)
            processGetSeriesWithName(null, seriesDetails.results)

        }
    })

}


module.exports = {

    getPopularSeries: getPopularSeries,
    getSeriesWithId: getSeriesWithId,
    getSeriesWithName: getSeriesWithName
};