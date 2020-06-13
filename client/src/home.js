const global = require('./global.js');

module.exports = {
    getView: () => `
<div class="homeItems">
		<h1><img src='${global.logo}'></h1>
                    <div>
                        <h2>Chelas Open Tv Application</h2>
                        <p>Never miss any detail of your favorite tv show and don't forget those you've already seen.<br><br><em>Made in Chelas.</em>
                        </div>
            </div>
            
	`,
    run: () => {
    }
};
