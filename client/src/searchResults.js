const global = require('./global.js');
const api = require('./cota-api.js');

const Handlebars = require('handlebars');

const modListContentsTemplate =
    Handlebars.compile(`
        <ol class="results">
            {{#this}}
                <li><h3>{{name}}</h3></li>
                    <p>Overview : {{overview}}</p>
                    <p>Votes : {{vote_average}}</p>
                    <br>
            {{/this}}
        </ol>
`);

module.exports = {
    getView: () => `
		<h1><img src='${global.logo}'>Search Results</h1>

		<div id='results'></div>	
	`,
    authenticationRequired : false,
    run: (request) => {
        const itemsContainer = document.querySelector('#results');
        const seriesToSearch = request.args[0];

        api.getSeriesWithName(seriesToSearch)
            .then(seriesResult => {
                    if (seriesResult.success) {
                        itemsContainer.innerHTML = modListContentsTemplate(seriesResult.success.data);
                    } else {
                        //TODO :
                        itemsContainer.innerHTML = global.errorTemplate
                    }
                }
            );
    }
}
