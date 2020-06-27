const api = require('./cota-api.js');


const Handlebars = require('handlebars');

const loggedInTemplate =
    Handlebars.compile(`	
		<span class='userInfo'>
			<a href="#account" style="padding:25px;  color: #ffffff"><i class="fas fa-user"></i> {{this}}</a>
			<a href='#logout'><button class="btn btn-danger" type="button"><i class="fas fa-sign-out-alt"></i> Log Out</button></a>
		</span>
	`);

const loggedOut = `
		<span class='userInfo'>
			<a href='#signIn' style="padding: 25px;color: #ffffff;">Sign In</a>
			<a href='#signUp'<button class="btn btn-primary" type="button">Sign Up</button></a>
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


module.exports = {

    initialize: (userInfo) => {

        userInfoBox = userInfo;
        return api.getUser()
            .then(userResponse => {
                if (userResponse.success) {
                    setCurrentUser(userResponse.success.data);
                } else {
                    setCurrentUser(null);
                }
            })
            .catch(() => {
                setCurrentUser(null);
            })

    },

    getCurrentUser: () => currUsername,

    signIn: {
        getView: () => `
			<h1>Sign In</h1>


			<form class= "col-lg-6 offset-lg-3">
			    <div class="form-group">
				    <label for='txtUsername'>Username: </label>
				    <input type='text' class="form-control" id='txtUsername' placeholder="Enter Username" required><br>
				    <label for='txtPassword'>Password : </label>
				    <input type='password' class="form-control" id='txtPassword' placeholder="Enter Password" required><br>
				    <button type="submit" class="btn btn-primary" id='butSignIn'>Sign In</button>
			    </div>
			</form>
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
                const password = txtPassword.value;
                if (password.length === 0) {
                    alert('Password is empty.');
                    return;
                }
                return api.signIn(username, password)
                    .then(loginResponse => {
                        if (loginResponse.success) {
                            alert(`Welcome ${loginResponse.success.data}`);
                            setCurrentUser(loginResponse.success.data);
                            /*
                            const navbar = document.querySelector('#navBarLinks');
                            navbar.innerHTML += '<a href=\'#publicGroups\' class="nav-item nav-link" >Shared Groups</a>';
                            */
                            location.assign(`#${(req.args && req.args[0]) || 'home'}`);
                        } else return Promise.reject(loginResponse.error.detail);

                    }).catch(error => {
                        alert(error);
                        txtUsername.value = "";
                        txtPassword.value = "";
                    })

            }
        }
    },

    signUp: {
        getView: () => `
			<h1>Sign Up</h1>

			<form class= "col-lg-6 offset-lg-3">
			    <div class="form-group">
				    <label for='txtUsername'>Username: </label>
				    <input type='text' class="form-control" id='txtUsername' placeholder="Enter Username" required><br>
				    <label for='txtPassword'>Password : </label>
				    <input type='password' class="form-control" id='txtPassword' placeholder="Enter Password" required><br>
				    <button type="submit" class="btn btn-primary" id='butSignUp'>Sign Up</button>
			    </div>
			</form>
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

                return api.signUp(username, password)
                    .then(response => {
                        if (response.success) {
                            api.signIn(username, password)
                                .then(loginResponse => {
                                    if (loginResponse.success) {
                                        setCurrentUser(loginResponse.success.user);
                                        alert(`Thanks ${username} for joining Chelas `);
                                        location.assign(`#${(req.args && req.args[0]) || 'home'}`);
                                    }
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
