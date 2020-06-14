const global = require('./global.js');
const api = require('./cota-api.js');
const auth = require('./auth.js');

module.exports = {
    getView: () => {
        let currentUser = auth.getCurrentUser();
        return `
		<h1><img src='${global.logo}'>${currentUser}'s Account</h1>
		
		<h3>Account Statistics :</h3>
		<ul>
		<li id="groupsCount"></li><br>
		<li id="seriesCount"></li><br>
        </ul>
		
		<h3>Would you like to create a new Group?</h3><br>
		
		        <div>
				    <label for='groupName'>Group Name : </label>
				    <input type='text' id="groupName"><br>
				    <label for='groupDesc'>Description : </label>
				    <input type='text' id="groupDesc"><br>
				    <input type='button' id='butCreate' value='Create'><br>
			    </div>	
	`
    },
    authenticationRequired: true,
    run: () => {
        const itemsContainer = document.querySelector('#account');

        api.getAllGroups()
            .then(allGroups => {
                    if (allGroups.success) {
                        let groupsCountField = document.getElementById("groupsCount");
                        let seriesCountField = document.getElementById("seriesCount");
                        let groupCounter = allGroups.success.data.length.toString();
                        let seriesCounter = 0;
                        allGroups.success.data.forEach((group) => {
                            seriesCounter+=group.series.length;
                        })
                        groupsCountField.innerHTML = `<b>${groupCounter}</b> Groups Registered`
                        seriesCountField.innerHTML = `Watched <b>${seriesCounter}</b> Series`
                    }
                }
            );

        //itemsContainer.innerHTML = modListContentsTemplate(allGroups.success.data)

    }
}
