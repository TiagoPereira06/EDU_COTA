const global = require('./global.js');
const api = require('./cota-api.js');

const Handlebars = require('handlebars');

const modListContentsTemplate =
    Handlebars.compile(`
        <ul class="groups_list">
            {{#this}}
                <h3>{{name}}</h3>
                <p>Description : {{desc}}</p>
                    <p><b>Series :</b></p>
                    {{#series}}
                    <ul>
                    <b>{{name}}</b>
                    <li>Overview : {{overview}}</li>
                    <li>Votes : {{vote_average}}</li>
                    </ul>
                    <br>
                {{/series}}
                <br>
            {{/this}}
        </ul>
`);

module.exports = {
    getView: () => `
		<h1><img src='${global.logo}'>All Groups</h1>

		<div id='allgroups'></div>	
	`,
    run: () => {
        const itemsContainer = document.querySelector('#allgroups');

        api.getAllGroups()
            .then(allGroups => {
                    if (allGroups.success)
                        itemsContainer.innerHTML = modListContentsTemplate(allGroups.success.data)
                }
            );
    }
}
