'use strict';

function getPopularSeries(page) {
    return fetch(`http://localhost:8080/series/popular/${page}`)
    .then(response => {
        return response.json()
    });
}

function getSeriesWithName(seriesName) {
    return fetch(`http://localhost:8080/series/${seriesName}`)
    .then(response => {
        return response.json()
    });
}

function getAllGroups() {
    return fetch(`http://localhost:8080/groups`)
    .then(response => {
        return response.json()
    });
}

function getGroupByName(groupName) {
    return fetch(`http://localhost:8080/groups/${groupName}`)
    .then(response => {
        return response.json()
    });
}

function getSeriesBetweenInterval(groupName, min, max) {
    return fetch(`http://localhost:8080/groups/${groupName}/series/${min}&:${max}`)
    .then(response => {
        return response.json()
    });
}

module.exports = {
    getPopularSeries : getPopularSeries,
    getSeriesWithName : getSeriesWithName,
    getAllGroups : getAllGroups,
    getGroupByName : getGroupByName,
    getSeriesBetweenInterval : getSeriesBetweenInterval
};