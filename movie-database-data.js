const API_URL_START = "https://api.themoviedb.org";
const API_KEY = '0c9b2502c13f4dcc2217113f2adf3788'
const language= 'en-US'


const request = require('request');

function getPopularSeries(processGetPopularSeries,page) {

    const options = {
        'method': 'GET',
        'uri': `${API_URL_START}/3/tv/popular?api_key=${API_KEY}&language=${language}&page=${page}`,
    }
    request.get(options, (err, res, body) => {
        if(err == null) {
            popularSeriesObj = JSON.parse(body)
            var series = []
           /* for (var prop in popularSeriesObj) {
               
               console.log(popularSeriesObj.results["name"])
                series.push(popularSeriesObj.results["name"])
               
              }
*/
            processGetPopularSeries(null, popularSeriesObj.results) // All series and all properties
            
        }
    });
}

module.exports = {

getPopularSeries: getPopularSeries
}