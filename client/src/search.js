const global = require('./global.js');
const formTemplate =
    `
                <label>Tv Show Name:</label>
                <input type="text" id="name">
                <button id="submitButton" type="button">Search!</button>	`;
function search(){
    const query = document.getElementById('name').value
    if (query)
        location.hash = `#searchResults/${query}`;
}

module.exports = {
    getView: () => `
		<h1><img src='${global.logo}'>Search Engine</h1>

		<div id='searchDiv'></div>	
	`,
    authenticationRequired : false,
    run: () => {
        const itemsContainer = document.querySelector('#searchDiv');
        itemsContainer.innerHTML = formTemplate;
        let button = document.getElementById("submitButton");
        button.addEventListener("click" , () => {search()})
        /*button.addEventListener("keyup",(event)=>{
            if (event.keyCode === 13){
                button.click();
            }
        })*/
    }
}
