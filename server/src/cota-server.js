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
app.post('/login', seriesWebApi.login)
app.post('/logout', seriesWebApi.logout)
app.get('/user', seriesWebApi.getUser)

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