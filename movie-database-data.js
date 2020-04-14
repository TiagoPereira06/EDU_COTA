const util = require('./cota-utils.js')
const request = require('request');

function getPopularSeries(processGetPopularSeries,page) {

    const options = {
        'method': 'GET',
        'uri': `${util.API_URL_START}/3/tv/popular?api_key=${util.API_KEY}&language=${util.language}&page=${page}`,
    };
    request.get(options, (err, res, body) => {
        if(err == null) {
            popularSeriesObj = JSON.parse(body);

            processGetPopularSeries(null, popularSeriesObj.results.map(e => [{"name":e.original_name,}])) // All series name
            
        }
    });
}

function getSeriesWithId(id,processGetSeriesWithId){

    const options = {
        'method': 'GET',
        'uri': `${util.API_URL_START}/3/tv/${id}?api_key=${util.API_KEY}&language=${util.language}`,
    };
    request.get(options,(err,res,body) =>{
        if (err == null){
            seriesDetails= JSON.parse(body)
            processGetSeriesWithId(null,seriesDetails)

        }
    })

}

function getSeriesWithName(name,processGetSeriesWithName){
    const options = {
        'method': 'GET',
        'uri': `${util.API_URL_START}/3/search/tv/?api_key=${util.API_KEY}&language=${util.language}&query=${name}`,
    };
    request.get(options,(err,res,body) =>{
        if (err == null){
            seriesDetails= JSON.parse(body)
            processGetSeriesWithName(null,seriesDetails.results)

        }
    })

}



module.exports = {

    getPopularSeries: getPopularSeries,
    getSeriesWithId: getSeriesWithId,
    getSeriesWithName:getSeriesWithName
};