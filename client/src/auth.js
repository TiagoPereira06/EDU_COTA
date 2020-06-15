const api = require('./cota-api.js');

const global = require('./global.js');

const Handlebars = require('handlebars');

const loggedInTemplate =
    Handlebars.compile(`	
		<span class='userInfo'>
			User: {{this}} | 
			<a href="#account">My Account</a> |
			<a href='#logout'>Logout</a>
		</span>
	`);

const loggedOut = `
		<span class='userInfo'>
			<a href='#signUp'>Sign Up</a> | 
			<a href='#signIn'>Sign In</a>
		</span>
	`;

let currUsername = null;
let userInfoBox;

function setCurrentUser(username) {
    currUsername = username;
    userInfoBox.innerHTML = username ?
        loggedInTemplate(username) :
        loggedOut;
}

function checkIfIsEmpty(value, tag) {
    if (value.length === 0) {
        alert(`${tag} is empty.`);
    }
}

module.exports = {

    initialize: (userInfo) => {

        userInfoBox = userInfo;
        return api.getUser()
            .then(userResponse => {
                setCurrentUser(userResponse.user);
            })
            .catch(() => {
                setCurrentUser(null);
            })

    },

    getCurrentUser: () => currUsername,

    signIn: {
        getView: () => `
			<h1><img src='${global.logo}'>Sign In</h1>


			<div>
				<label for='txtUsername'>Username: </label>
				<input type='text' id='txtUsername'><br>
				<label for='txtPassword'>Password : </label>
				<input type='password' id='txtPassword'><br>
				<input type='button' id='butSignIn' value='Sign In'>
			</div>
		`,

        run: (req) => {
            const txtUsername = document.querySelector('#txtUsername');
            const txtPassword = document.querySelector('#txtPassword');
            const butLogin = document.querySelector('#butSignIn');

            butLogin.onclick = () => {
                const username = txtUsername.value;
                if (username.length === 0) {
                    alert('Username is empty.');
                    return;
                }
                //checkIfIsEmpty(username, "Username");
                const password = txtPassword.value;
                //checkIfIsEmpty(password, "Username");
                if (password.length === 0) {
                    alert('Password is empty.');
                    return;
                }
                api.signIn(username, password)
                    .then(loginResponse => {
                        if (loginResponse.user) {
                            alert(`Welcome ${loginResponse.user}`);
                            setCurrentUser(loginResponse.user);
                            location.assign(`#${(req.args && req.args[0]) || 'home'}`);
                        } else return Promise.reject(loginResponse);

                    }).catch(error => {
                    alert(error.error);
                    txtUsername.value = "";
                    txtPassword.value = "";
                })

            }
        }
    },

    signUp: {
        getView: () => `
			<h1><img src='${global.logo}'>Sign Up</h1>


			<div>
				<label for='txtUsername'>Username: </label>
				<input type='text' id='txtUsername'><br>
				<label for='txtPassword'>Password : </label>
				<input type='password' id='txtPassword'><br>
				<input type='button' id='butSignUp' value='Sign Up'>
			</div>
		`,

        run: (req) => {
            const txtUsername = document.querySelector('#txtUsername');
            const txtPassword = document.querySelector('#txtPassword');
            const butLogin = document.querySelector('#butSignUp');

            butLogin.onclick = () => {
                const username = txtUsername.value;
                if (username.length === 0) {
                    alert('Username is empty.');
                    return;
                }
                const password = txtPassword.value;
                if (password.length === 0) {
                    alert('Password is empty.');
                    return;
                }

                api.signUp(username, password)
                    .then(response => {
                        if (response.success) {
                            api.signIn(username, password)
                                .then(loginResponse => {
                                    setCurrentUser(loginResponse.user);
                                    alert(`Thanks ${username} for joining Chelas `);
                                    location.assign(`#${(req.args && req.args[0]) || 'home'}`);
                                })
                        } else {
                            return Promise.reject(response.error.detail)
                        }
                    })
                    .catch(errorMsg => {
                        alert(errorMsg);
                        txtUsername.value = "";
                        txtPassword.value = "";
                    })

            }
        }
    },

    logout: {
        run: () => {
            api.logout()
                .catch(error => {
                    alert(error);
                })
                .then(() => {
                    alert(`See you soon ${currUsername}! Bye.`);
                    setCurrentUser(null);
                    location.assign('#home');
                })
        }
    }
}
