const utils = require('./cota-utils');

const baseUrl = `http://${utils.ES_HOST}:${utils.ES_PORT}`;

function getGroupByName(groupName) {
    return new Promise((resolve, reject) => {
        const fetchPromise = fetch(`${baseUrl}/groups/_search`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "size": 1,
                "query": {
                    "match": {
                        "name": groupName
                    }
                }
            })
        })
    })
}

function createGroup(name, desc) {
    return new Promise((resolve, reject) => {
        const fetchPromise = fetch(`${baseUrl}/groups/_doc`, {
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
        /*if (fetchPromise === null) reject(utils.getErrObj(404))
        resolve({"status": "Group Created!"})*/
    })
}

function getGroups() {
    return new Promise(function (resolve, reject) {
        const options = utils.requestDatabaseOptions('POST', 'groups/_doc', {
            "name": groupName,
            "desc": groupDesc,
            "games": []
        })
        request.post(options, (err, res, body) => {
            if (err == null) {
                resolve({"status": "Group created"})
            } else {
                reject(utils.getErrObj(503))
            }
        });
    })

}

function updateGroup(oldName, newName, newDesc, processGetGroups) {

}

function addSeriesToGroup(groupName, series, processAddSeriesToGroup) {

}

function deleteSeriesFromGroup(groupName, seriesName, processDeleteSeriesFromGroup) {

}

function getSeriesBetweenInterval(groupName, min, max, processgetSeriesBetweenInterval) {

}

module.exports = {
    createGroup: createGroup,
    getGroupByName: getGroupByName,
    getGroups: getGroups,
    updateGroup: updateGroup,
    addSeriesToGroup: addSeriesToGroup,
    deleteSeriesFromGroup: deleteSeriesFromGroup,
    getSeriesBetweenInterval: getSeriesBetweenInterval
}



