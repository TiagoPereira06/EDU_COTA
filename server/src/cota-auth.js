const passport = require('passport');

const session = require('express-session');

const services = require('./cota-services');

const FileStore = require('session-file-store')(session);

function userToRef(user, done) {
    done(null, user.username);
}

function refToUser(userRef, done) {
    services.getUserByName(userRef)
        .then(user => {
            done(null, user)
        })
        .catch(done("User Unknown"))
}

module.exports = {
    initialize: app => {
        app.use(session({
            resave: false,
            saveUninitialized: false,
            secret: 'iselleic',
            store: new FileStore()
        }));

        app.use(passport.initialize(undefined));
        app.use(passport.session());

        passport.serializeUser(userToRef);
        passport.deserializeUser(refToUser);
    },

    getUser: (username, password) => {
        return services.getUserByName(username)
            .then(success => {
                if (success.data && success.data.password === password) {
                    return Promise.resolve(success.data);
                }
            })
            .catch(() => {
                return Promise.reject('Invalid username or password.');
            })
    }
}
