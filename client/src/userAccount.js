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
		<li id="publicGroupsCount"></li><br>
		<li id="privateGroupsCount"></li><br>
		<li id="seriesCount"></li><br>
        </ul>
		
		<h3>Not Enough ? Create One More!</h3>
		
		        <div>
				    <label for='groupName'>Group Name : </label>
				    <input type='text' id="groupName"><br>
				    <label for='groupDesc'>Description : </label>
				    <input type='text' id="groupDesc"><br>
				    <br>
				    <div id="toppings">Visibility :
                    <br>
                    <br><label><input type="checkbox" name="public"/> Public</label>
                    <label><input type="checkbox" name="private"/> Private</label>
                    </div><br>
				    <input type='button' id='butCreate' value='Create'><br>
			    </div>
			    <div class = "navButtons"><br>
			    <button id="nextButton" class="navButton">Private Groups</button>
			    <button id="nextButton" class="navButton">Public Groups</button>
			    </div>	
	`
    },
    authenticationRequired: true,
    run: () => {
        const itemsContainer = document.querySelector('#account');

        api.getGroups()
            .then(allGroups => {
                    if (allGroups.success) {
                        let publicField = document.getElementById("publicGroupsCount");
                        let privateField = document.getElementById("privateGroupsCount");
                        let seriesCountField = document.getElementById("seriesCount");
                        let publicCounter = allGroups.success.data.filter((group) => group.visibility === "public");
                        let privateCounter = allGroups.success.data.filter((group) => group.visibility === "private");
                        let seriesCounter = 0;
                        allGroups.success.data.forEach((group) => {
                            seriesCounter += group.series.length;
                        })
                        publicField.innerHTML = `<b>${publicCounter.length}</b> <u>Public</u> Groups Registered`
                        privateField.innerHTML = `<b>${privateCounter.length}</b> <u>Private</u> Groups Registered`
                        seriesCountField.innerHTML = `Watched <b>${seriesCounter}</b> Series`
                    }
                }
            ).catch(err => {
            alert(err)
        });

        //itemsContainer.innerHTML = modListContentsTemplate(allGroups.success.data)

    }
}
