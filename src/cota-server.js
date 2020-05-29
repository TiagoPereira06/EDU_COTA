'use strict';
const express = require('express');
const session = require('express-session')
const utils = require('./cota-utils');
const seriesWebApi = require('./cota-web-api');
const passport = require('passport')

const app = express();

app.use(session({
	resave: false,
	saveUninitialized: false,
	secret: 'iselleic'
}));

app.use(express.json())
app.use('/', express.static(__dirname + '/public'))

app.use(passport.initialize()); 
app.use(passport.session()); 

passport.serializeUser(seriesWebApi.serializeUser)
passport.deserializeUser(seriesWebApi.deserializeUser)

app.post('/login', seriesWebApi.validateLogin)
app.get('/auth', seriesWebApi.verifyAuthenticated)
app.post('/register', seriesWebApi.registerUser)
app.put('/logout', seriesWebApi.logout)

app.get('/series/popular/:page', seriesWebApi.getMostPopularSeries);
app.get('/series/:seriesName', seriesWebApi.getSeriesByName);
app.put('/groups/:groupName', seriesWebApi.updateGroup);
app.post('/groups', seriesWebApi.createGroup);
app.get('/groups', seriesWebApi.getAllGroups);
app.get('/groups/:groupName', seriesWebApi.getGroupByName);
app.put('/groups/:groupName/series', seriesWebApi.addSeriesToGroup);
app.delete('/groups/:groupName/series/:seriesName', seriesWebApi.deleteSeriesFromGroup);
//app.delete('/groups/:groupName', seriesApi.deleteGroup)
app.get('/groups/:groupName/series/:min&:max', seriesWebApi.getSeriesBetweenInterval);


app.listen(utils.SERVER_PORT, () => console.log(`Server listening on port ${utils.SERVER_PORT}`));