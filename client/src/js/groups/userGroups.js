const api = require('../cota-api.js');
const auth = require('../auth.js');
const global = require('../global.js');

const handlebars = global.handlebars;

const modListContentsTemplate =
    handlebars.compile(`
            <div class="card-columns card-userGroup m-3 text-center">
            {{#this}}
            <a href="#group/{{path name}}" class="custom-card">
            <div class="card text-center">
                <div class="card-header bg-primary">
                {{name}}
                {{{groupVis visibility}}}
                {{{count series}}}
                </div>
                <div class="card-body">
                <p class="card-text">{{desc}}</p>
                </div>
            </div>
            </a>
            {{/this}}
            </div>
`);

module.exports = {
    getView: () => {
        let currentUser = auth.getCurrentUser();
        return `
		<h1>${currentUser}'s Groups</h1>

		<div id='groups'>
		${global.spinner}
        </div>	
	`
    },
    authenticationRequired: true,
    run: () => {
        const itemsContainer = document.querySelector('#groups');
        api.getGroups()
            .then(allGroups => {
                    if (allGroups.success) {
                        let groups = allGroups.success.data;
                        itemsContainer.innerHTML = modListContentsTemplate(groups)
                    }
                }
            );
    }
}
