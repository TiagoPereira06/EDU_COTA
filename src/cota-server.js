const express = require('express');
const utils = require('./cota-utils');
const seriesApi = require('./cota-web-api');

const app = express();

app.use(express.json());

app.get('/series/popular/:page', seriesApi.getMostPopularSeries);
app.get('/series/:seriesName', seriesApi.getSeriesByName);

app.put('/groups/:groupName', seriesApi.updateGroup);
app.post('/groups', seriesApi.createGroup);
app.get('/groups', seriesApi.getAllGroups);
app.get('/groups/:groupName', seriesApi.getGroupByName); //get details
app.put('/groups/:groupName/series/:seriesName', seriesApi.addSeriesToGroup);
app.delete('/groups/:groupName/series/:seriesName', seriesApi.deleteSeriesFromGroup);
//app.delete('/groups/:groupName', seriesApi.deleteGroup)
app.get('/groups/:groupName/series/:min&:max', seriesApi.getSeriesBetweenInterval);


app.listen(utils.SERVER_PORT, () => console.log(`Server listening on port ${utils.SERVER_PORT}`));