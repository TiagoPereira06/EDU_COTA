'use strict';
const utils = require('./cota-utils');
const fetch = require('node-fetch')

const baseUrl = utils.ES_URI;

function getGroupByName(groupName) {
    return fetch(`${baseUrl}/groups/_search?q=name:${groupName}`, {
        headers: {
            "Content-Type": "application/json"
        },
    })
        .then(response => response.json())
        .then(body => {
            let hit = body.hits.hits;
            if (hit.length) return hit[0]._source;
            return undefined;
        })
        .catch(() => Promise.reject("Error in GetGroupByName process"))
}

function getGroups() {
    return fetch(`${baseUrl}/groups/_search`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(body => body.hits.hits.map(hit => hit._source))
        .catch(() => Promise.reject("Error in GetGroup process "))
}

function createGroup(name, desc) {
    return fetch(`${baseUrl}/groups/_doc`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "name": name,
            "desc": desc,
            "series": []
        })
    })
        .then(response => response.json())
        .then(body => body.result)
        .catch(() => Promise.reject("Error in CreateGroup process "))
}


function updateGroup(oldName, newName, newDesc) {
    return fetch(`${baseUrl}/groups/_doc/_update_by_query`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "query": {
                "match": {
                    "name": `${oldName}`
                }
            },
            "script": {
                "source": "ctx._source.name = params.name; ctx._source.desc = params.desc",
                "params": {
                    "name": `${newName}`,
                    "desc": `${newDesc}`,
                }
            }
        })
    })
        .then(response => response.json())
        .then(body => body.updated)
        .catch(() => Promise.reject("Error in UpdateGroup process "))

}

function addSeriesToGroup(groupName, series) {
    return fetch(`${baseUrl}/groups/_doc/_update_by_query`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "query": {
                "match": {
                    "name": `${groupName}`
                }
            },
            "script": {
                "lang": "painless",
                "inline": "ctx._source.series.add(params.newSeries)",
                "params": {
                    "newSeries": series
                }
            }
        })
    })
        .then(response => response.json())
        .then(body => body.updated)
        .catch(() => Promise.reject("Error in addSeriesToGroup process "))

}

function getSeriesIdByGroupName(groupName, seriesName) {
    return fetch(`${baseUrl}/groups/_search?q=name:${groupName}`, {
        headers: {
            "Content-Type": "application/json"
        },
    })
        .then(response => response.json())
        .then(body => {
            let hit = body.hits.hits[0]._source.series;
            if (hit.length) return hit.findIndex(obj => obj.name === seriesName);
            return undefined;
        })
        .catch(() => Promise.reject("Error in getSeriesIdByGroupName process "))
}

function deleteSeriesFromGroup(groupName, seriesIndex) {
    return fetch(`${baseUrl}/groups/_doc/_update_by_query`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                    "query": {
                        "match": {
                            "name": `${groupName}`
                        }
                    },
                    "script": {
                        "lang": "painless",
                        "inline": "ctx._source.series.remove(params.deleteSeries)",
                        "params": {
                            "deleteSeries": seriesIndex
                        }
                    }
                }
            )
        }
    )
        .then(response => response.json())
        .then(body => body.updated)
        .catch(() => Promise.reject("Error in addSeriesToGroup process "))
}

function deleteGroup(groupName) {
    return fetch(`${baseUrl}/groups/_doc/_delete_by_query`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "query": {
                "match": {
                    "name": `${groupName}`
                }
            }
        })
    })
        .then(response => response.json())
        .then(body => body.deleted)
        .catch(() => Promise.reject("Error in DeleteGroup process "))
}

module.exports = {
    createGroup: createGroup,
    deleteGroup : deleteGroup,
    getGroupByName: getGroupByName,
    getGroups: getGroups,
    updateGroup: updateGroup,
    addSeriesToGroup: addSeriesToGroup,
    deleteSeriesFromGroup: deleteSeriesFromGroup,
    getSeriesIdByGroupName: getSeriesIdByGroupName,
}



