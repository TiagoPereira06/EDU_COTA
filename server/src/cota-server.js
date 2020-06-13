'use strict';
const express = require('express');
const auth = require('./cota-auth.js');
const cors = require('cors')
const utils = require('./cota-utils');
const seriesWebApi = require('./cota-web-api');

const app = express();
auth.initialize(app);

app.use(express.json())
app.use(express.static('../client/dist'));


app.use(cors());
app.post('/users/signin', seriesWebApi.signIn)
app.post('/users/logout', seriesWebApi.logout)
app.post('/users/signup', seriesWebApi.signUp)
app.get('/users/user', seriesWebApi.getUser)

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