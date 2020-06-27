const api = require('../cota-api.js');
const global = require('../global');


global.handlebars.compile(
    `
    <div class="alert alert-success m-5" role="alert">
    {{this}}
</div>
`);
module.exports = {
    getView: () => {
        return `
		<div id='alert'>
		${global.spinner}
        </div>
		<div class="text-center">
		<button type="button" id="backButton" class="btn btn-primary text-center">Go Back</button>
		</div>	
	`
    },
    authenticationRequired: true,
    run: (request) => {
        const groupName = global.formatName(request.args[0]);
        const seriesName = global.formatName(request.args[1]);
        // const alertContainer = document.querySelector('#alertContainer');
        const alertContainer = document.querySelector('#alert');
        const backButton = document.querySelector('#backButton')

        backButton.onclick = () => {
            window.history.back();
        }

        api.addSeriesToGroup(groupName, seriesName)
            .then((response) => {
                if (response.success) {
                    alertContainer.innerHTML = /*`
                    <div class="alert alert-success m-5" role="alert">
                    ${seriesName} added to ${groupName}
                    </div>`;*/
                    global.successTemplate(`${seriesName} added to ${groupName}`);
                    // window.history.back();
                } else {
                    alertContainer.innerHTML = global.errorTemplate(`${response.error.detail}`);
                    // window.history.back();
                }
            })
    }
}