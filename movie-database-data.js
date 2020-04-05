const API_URL_START = "https://api.themoviedb.org";
const API_KEY = '0c9b2502c13f4dcc2217113f2adf3788'
const language= 'en-US'
const page = 1

const request = require('request');

function getPopularSeries(processGetPopularSeries) {

    const options = {
        'method': 'GET',
        'uri': `${API_URL_START}/3/tv/popular?api_key=${API_KEY}&language=${language}&page=${page}`,
    }
    request.get(options, (err, res, body) => {
        if(err == null) {
            popularSeriesObj = JSON.parse(body)
        /*    series = []
            for(i = 0; i < popularSeriesObj.series.length; i++) {
                g = {}
            
                g.name = popularSeriesObj.series[i].name
               
                series.push(g)
            }*/
            processGetPopularSeries(null, popularSeriesObj ) //series
            
        }
    });
}

module.exports = {

getPopularSeries: getPopularSeries
}