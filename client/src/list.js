const global = require('./global.js');
const api = require('./cota-api.js');

const Handlebars = require('handlebars');

const modListContentsTemplate =  
	Handlebars.compile(`	
		<ul>
			{{#each items}}
				<li>{{this}}</li>
			{{/each}}
		</ul>
	`);

module.exports = {
	getView: () => `
		<h1><img src='${global.logo}'>All Groups</h1>

		<div id='all-groups'></div>	
	`,
	run: () => {
		const itemsContainer = document.querySelector('#all-groups');

		api.getAllGroups()
		.then(allGroups => {
			if(allGroups.success)
			itemsContainer.innerHTML = modListContentsTemplate(allGroups.success.data)
		}
		);
}
}
