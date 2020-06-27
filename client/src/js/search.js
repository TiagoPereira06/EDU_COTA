const global = require('./global.js');
const api = require('./cota-api.js');

const handlebars = global.handlebars;

const modListContentsTemplate =
    handlebars.compile(global.seriesGroupTemplate("this"));

module.exports = {
    getView: () => `
		<h1>Search Results</h1>

		<div id='results'></div>	
	`,
    authenticationRequired: false,
    run: (request) => {
        const itemsContainer = document.querySelector('#results');
        const seriesToSearch = request.args[0];

        api.getSeriesWithName(seriesToSearch)
            .then(seriesResult => {
                    if (seriesResult.success) {
                        api.getGroups()
                            .then((allGroups) => {
                                    const result = seriesResult.success.data;
                                    if (allGroups.success) {
                                        let groups = allGroups.success.data;
                                        groups = groups.sort((a, b) => (a.visibility > b.visibility) ? 1 : -1)
                                        result.forEach((series) => {
                                            series.groups = groups;
                                        })
                                        itemsContainer.innerHTML = modListContentsTemplate(seriesResult.success.data);
                                    } else {
                                        result.forEach((series) => {
                                            series.groups = [];
                                        })
                                        itemsContainer.innerHTML = modListContentsTemplate(seriesResult.success.data);
                                    }
                                }
                            )
                    }
                }
            )
            .catch(() => itemsContainer.innerHTML = global.errorTemplate);
    }
}
