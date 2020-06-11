const global = require('./global.js');
const api = require('./cota-api.js');

const Handlebars = require('handlebars');

let modListContentsTemplate =
    Handlebars.compile(`
        <ul>
            {{#series}}
                <h3>{{name}}</h3>
                <p>Description : {{overview}}</p>
                <p>Votes : {{votes}}</p>
                <br>
            {{/series}}
        </ul>
        <br>
        <button id="nextButton" type="button">Next</button> 
        <p id="pageNumber">{{pageCount}}</p> 
        <button id="prevButton" type="button">Prev</button>
`), nextButton, prevButton, page = 1, itemsContainer;

function getSeries(pageCounter, itemsContainer) {
    return api.getPopularSeries(pageCounter)
        .then(popularSeries => {
                if (popularSeries.success)
                    itemsContainer.innerHTML = modListContentsTemplate({
                        series: popularSeries.success.data,
                        pageCount: pageCounter
                    })
            }
        )
        .catch(() => "Error");
}

function fetchNextPage() {
    page++;
    getSeries(page, itemsContainer).then(() => {setupListeners()});
}
function fetchPrevPage() {
    if (page > 1) {
        page--;
        getSeries(page, itemsContainer).then(() => {setupListeners()});
    }
}

function setupListeners() {
    nextButton = document.getElementById("nextButton");
    prevButton = document.getElementById("prevButton");
    nextButton.addEventListener("click", fetchNextPage);
    prevButton.addEventListener("click", fetchPrevPage);
}

module.exports = {
    getView: () => `
		<h1><img src='${global.logo}'>Most Popular TV Shows</h1>

		<div id='mostpopular'></div>	
	`,
    run:() => {
        itemsContainer = document.querySelector('#mostpopular');
        getSeries(page, itemsContainer)
            .then((response) => {
                if (response !== "Error"){
                    setupListeners();
                }

            }

        )

    }
}
