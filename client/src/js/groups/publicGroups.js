const api = require('../cota-api.js');
const auth = require('../auth.js');
const global = require('../global.js');

const handlebars = global.handlebars;

const modListContentsTemplate =
    handlebars.compile(`
        <ul class="groups_list">
            {{#this}}
                <h3>{{name}}</h3>
                <p>Description : {{desc}}</p>
                <p>Visibility : {{visibility}}</p>
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
    getView: () => {
        return `
		<h1>Public Groups</h1>

		<div id='allgroups'></div>	
	`
    },
    authenticationRequired: false,
    run: () => {
        const itemsContainer = document.querySelector('#allgroups');
/*
        const alertContainer = document.querySelector('#alertContainer');
*/


        api.getAllPublicGroups()
            .then(publicGroups => {
                    if (publicGroups.success) {
                        itemsContainer.innerHTML = modListContentsTemplate(publicGroups.success.data);
                    } else {
                        itemsContainer.innerHTML = global.errorTemplate("You Must Be Logged In");
                    }
                }
            )
    }
}