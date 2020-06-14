require('./css/style.css');
const routes = require('./routes.js');
const auth = require('./auth.js');

window.onload = () => {

    const [mainContainer, userinfo] = setBaseTemplate();

    auth.initialize(userinfo);

    window.onhashchange = onHashChange;

    if (location.hash) {
        onHashChange();
    } else {
        location.hash = '#home';
    }

    function onHashChange() {
        let [modName, ...args] = location.hash.substring(1).split('/');

        const module = getModule(modName);

        const request = {'name': modName, 'args': args};

        if(module.authenticationRequired){
            if (auth.getCurrentUser() == null){
                alert("You Must Be Logged In To Access This Feature");
                modName = '#home';
            }
        }
        module.getView && (mainContainer.innerHTML = module.getView());

        module.run && module.run(request);
    }

    function setBaseTemplate() {
        document.body.innerHTML = `
			<nav>
			    <div class='navbar'>
			        <div class='navigation'>
				        <a href='#home'>Home</a> |
				        <a href='#mostPopular'>MostPopular</a> |				
				        <a href='#search'>Search</a> 
				    </div>
				    <div id='userInfo'>
				    </div>
			    </div>
			</nav>
			<hr>
			<div id='mainContainer'></div>
		`;

        const mainContainer = document.querySelector('#mainContainer');
        const userInfo = document.querySelector('#userInfo');

        return [mainContainer, userInfo];
    }

    function getModule(name) {

        const modDefault = {
            getView: (req) => '<h1>' + req.name + '</h1>',
            authenticationRequired : false,
            run: () => {
            }
        };

        return routes[name] || modDefault;
    }


}
