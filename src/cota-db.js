const utils = require('./cota-utils');
const {getErrObj} = require("./cota-utils");
const fetch = require ('node-fetch')

const baseUrl =utils.ES_URI;

function getGroupByName(groupName) {
    return new Promise(function(resolve,reject) {
        const options = {
            'method': 'GET',
            'json': true,
            'body': {
                'size': 1,
                'query' : {
                    'match': {
                        'name': groupName
                    }
                }
            }
        };
            const fetchPromise = fetch (`${baseUrl}/groups/_search`,options)
            if(fetchPromise === null) reject(getErrObj(404))
            resolve(
                fetchPromise
                    .then(response => response.json())
                    .then(body => body.hits.hits[0]._source)
                    .catch(err => {console.log(err)})
                    
            )
    
        })
}

function createGroup(name, desc) {
    return new Promise((resolve, reject) => {
        const fetchPromise = fetch(`${baseUrl}/groups/_doc`, {
            method: 'POST',
            body:{
                "name": name,
                "desc": desc,
                "series": []
            }
        })
        resolve(
            fetchPromise
            .then(response => response.json())
            .then(response =>{return {"status": "Group Created!"} })
            .catch(err => {console.log(" *****" + err)})
            )
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



