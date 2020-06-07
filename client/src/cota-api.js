'use strict';

function getPopularSeries(page) {
    return fetch(`/series/popular/${page}`)
    .then(response => {
        return response.json()
    });
}

function getSeriesWithName(seriesName) {
    return fetch(`/series/${seriesName}`)
    .then(response => {
        return response.json()
    });
}

function getAllGroups() {
    return fetch(`/groups`)
    .then(response => {
        return response.json()
    });
}

function getGroupByName(groupName) {
    return fetch(`/groups/${groupName}`)
    .then(response => {
        return response.json()
    });
}

function getSeriesBetweenInterval(groupName, min, max) {
    return fetch(`/groups/${groupName}/series/${min}&:${max}`)
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