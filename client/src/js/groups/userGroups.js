const api = require('../cota-api.js');
const auth = require('../auth.js');
const global = require('../global.js');

const handlebars = global.handlebars;

const modListContentsTemplate =
    handlebars.compile(`
            <div class="card-columns card-userGroup m-3">
            {{#this}}
            <div class="card text-center">
                <div class="card-header bg-primary">
                {{name}}
                {{{groupVis visibility}}}
                <a href="#editGroup/{{name}}" class="float-left text-dark">
                <i class="far fa-edit"></i>
                </a>
                </div>
                <div class="card-body text-center">
                <p class="card-text">{{desc}}</p>
                {{{count series}}}
                <a href="#group/{{path name}}">
                <button type="button" class="btn btn-primary mt-2 mb-1"><i class="fas fa-tv"></i> Shows</button>
                </a>
                </div>
            </div>
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
