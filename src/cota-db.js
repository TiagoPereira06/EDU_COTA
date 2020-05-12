'use strict'



function createGroup(name, desc, processCreateGroup) {
    let group = {
        name: name,
        desc: desc,
        series : []
    }
 
}

function getGroupByName(name, processGetGroup) {

}

function getGroups() {
    return new Promise(function(resolve, reject) {
        const options = utils.requestDatabaseOptions('POST', 'groups/_doc', {
            "name": groupName,
            "desc": groupDesc,
            "games": []
        })

        request.post(options, (err, res, body) => {
            if(err == null) {
                resolve({"status": "Group created"})
            } else {
                reject(utils.getErrObj(503))
            }
        });
    })
  
}

function updateGroup(oldName,newName,newDesc,processGetGroups) {
 
}

function addSeriesToGroup(groupName, series, processAddSeriesToGroup){

}
function deleteSeriesFromGroup(groupName, seriesName, processDeleteSeriesFromGroup){

}
function getSeriesBetweenInterval(groupName, min, max, processgetSeriesBetweenInterval){
 
}

module.exports = {
    createGroup: createGroup,
    getGroupByName: getGroupByName,
    getGroups: getGroups,
    updateGroup: updateGroup,
    addSeriesToGroup: addSeriesToGroup,
    deleteSeriesFromGroup : deleteSeriesFromGroup,
    getSeriesBetweenInterval: getSeriesBetweenInterval
    }



