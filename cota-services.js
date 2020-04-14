const api = require('./movie-database-data');
const db = require('./cota-db.js');

function getPopularSeries(processGetPopularSeries,page) {
    api.getPopularSeries(processGetPopularSeries,page)
}

function getSeriesWithId(seriesName, processGetSeriesWithId) {
    api.getSeriesWithId(seriesName, processGetSeriesWithId)
}


function getSeriesWithName(seriesName, processGetSeriesWithName) {
    api.getSeriesWithName(seriesName, processGetSeriesWithName)
}

function getGroups(processGetGroups) {

    db.getGroups(cb);

    function cb(err, groupsObj) {
        processGetGroups(err, groupsObj)
    }
}

function getGroup(groupName, processGetGroup) {
    
    db.getGroup(groupName, cb);

    function cb(err, groupObj) {
        processGetGroup(err, groupObj)
    }
}

function getSeriesBetweenInterval(groupName, min, max, processGetSeriesBetweenInterval) {
    
    db.getSeriesBetweenInterval(groupName, min, max, cb);

    function cb(err, gamesObj) {
        processGetSeriesBetweenInterval(err, gamesObj)
    }
    
}

function createGroup(groupName, groupDesc, processCreateGroup) {
    //TODO, verificar se já existe grupo com o mesmo nome

    /* db.getGroup(groupName, processGetGroup);

    function processGetGroup(err, groupObj) {
        if(!groupObj)
            db.createGroup(groupName, groupDesc, cb);
        else {
            errorMessageObj = {"error": "Group already exists"};
            processCreateGroup(err, errorMessageObj)
        }
    }
    */

  db.createGroup(groupName, groupDesc, cb);
    function cb(err, createdMessageObj) {
        processCreateGroup(err, createdMessageObj) // "created"
    }


}

function updateGroup(oldGroupName, newGroupName, newGroupDesc, processUpdateGroup) {
    db.updateGroup(oldGroupName, newGroupName, newGroupDesc, cb);

    function cb(err, updatedMessageObj) {
        processUpdateGroup(err, updatedMessageObj) // "updated"
    }
}

function addSeriesToGroup(groupName, seriesObj, processAddSeriesToGroup) {
    db.getGroup(groupName, processGetGroup);

    function processGetGroup(err, groupObj) {
        if(!groupObj) {
            errorMessageObj = {"error": "Group doesn't exist"};
            processAddSeriesToGroup(err, errorMessageObj)
        }
        else 
            db.addSeriesToGroup(groupName, seriesObj, cb)
    }

    function cb(err, updatedMessageObj) {
        processAddSeriesToGroup(err, updatedMessageObj)
    }
}

function getIndexOfSeriesInGroup(groupName, seriesId, processGetIndexOfSeriesInGroup) {
    db.getIndexOfSeriesInGroup(groupName, seriesId, cb);

    function cb(err, seriesIdx) {
        processGetIndexOfSeriesInGroup(err, seriesIdx)
    }
}

function deleteSeriesFromGroup(groupName, seriesIdx, processDeleteSeriesFromGroup) {
    db.deleteSeriesFromGroup(groupName, seriesIdx, cb);
    
    function cb(err, deletedMessageObj) {
        processDeleteSeriesFromGroup(0, deletedMessageObj)
    }
}

module.exports = {
    getPopularSeries: getPopularSeries,
    getSeriesWithId: getSeriesWithId,
    getSeriesWithName: getSeriesWithName,
    getGroups: getGroups,
    getGroup: getGroup,
    getSeriesBetweeninterval: getSeriesBetweenInterval,
    createGroup: createGroup,
    updateGroup: updateGroup,
    addSeriesToGroup: addSeriesToGroup,
    getIndexOfSeriesInGroup: getIndexOfSeriesInGroup,
    deleteSeriesFromGroup: deleteSeriesFromGroup
};