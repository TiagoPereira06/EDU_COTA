const express = require('express');
const utils = require('./cota-utils');
const seriesApi = require('./cota-web-api');

const app = express();

app.use(express.json());

app.get('/series/popular/:page', seriesApi.getPopularSeries);
app.get('/series/:seriesName', seriesApi.getSeriesWithName);
app.post('/groups', seriesApi.createGroup);
app.put('/groups/:groupName', seriesApi.updateGroup);
app.get('/groups', seriesApi.getGroups);
app.get('/groups/:groupName', seriesApi.getGroup); //get details
app.put('/groups/:groupName/series/:seriesName', seriesApi.addSeriesToGroup);
app.delete('/groups/:groupName/series/:seriesName', seriesApi.deleteSeriesFromGroup);
//app.delete('/groups/:groupName', seriesApi.deleteGroup)
app.get('/groups/:groupName/games/:min&:max', seriesApi.getSeriesBetweenInterval);


app.listen(utils.SERVER_PORT, () => console.log(`Server listening on port ${utils.SERVER_PORT}`));