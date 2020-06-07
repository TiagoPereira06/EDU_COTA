require('./style.css');
const routes = require('./routes.js');

window.onload = () => {

	const mainContainer = setBaseTemplate();

	window.onhashchange = onHashChange;

	if (location.hash) {
		onHashChange();
	} else {
		location.hash = '#home';
	}

	function onHashChange() {
		const [modName, ...args] = location.hash.substring(1).split('/');

		const mod = getMod(modName);

		const request = { 'name': modName, 'args': args };

		mainContainer.innerHTML = mod.getView();

		mod.run(request);
	}

	function setBaseTemplate() {
		document.body.innerHTML = `
			<nav>
				<a href='#home'>Home</a> |
				<a href='#list'>List</a>
			</nav>
			<hr>
			<div id='mainContainer'></div>
		`;

		return document.querySelector('#mainContainer');
	}

	function getMod(name) {

		const modDefault = {
			getView: (req) => '<h1>' + req.name + '</h1>',
			run: () => { }
		};

		return routes[name] || modDefault;
	}

}
