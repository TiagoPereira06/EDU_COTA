const api = require('./movie-database-data');
const db = require('./cota-db.js');

function getPopularSeries(processGetPopularSeries, page) {
    api.getPopularSeries(processGetPopularSeries, page)
}

function getSeriesWithId(seriesName, processGetSeriesWithId) {
    api.getSeriesWithId(seriesName, processGetSeriesWithId)
}


function getSeriesWithName(seriesName, processGetSeriesWithName) {
    api.getSeriesWithName(seriesName, processGetSeriesWithName)
}

function getAllGroups(processGetGroups) {

    db.getGroups(cb);

    function cb(err, groupsObj) {
        processGetGroups(err, groupsObj)
    }
}

function getGroupByName(groupName, processGetGroup) {

    db.getGroupByName(groupName, cb);

    function cb(err, groupObj) {
        processGetGroup(err, groupObj)
    }
}

function getSeriesBetweenInterval(groupName, min, max, processGetSeriesBetweenInterval) {
    if(min >=2 && max <= 10) db.getSeriesBetweenInterval(groupName,min,max,cb)
    else{
        let errormessageObj= {"error" :" Interval is not within a possible range"}
        cb(null,errormessageObj)
    }
    function cb(err, seriesObj) {
        processGetSeriesBetweenInterval(err, seriesObj)
    }

}

function createGroup(groupName, groupDesc, processCreateGroup) {
    db.getGroupByName(groupName, processGetGroup);

    function processGetGroup(err, groupObj) {
        if (!groupObj.length) {
            db.createGroup(groupName, groupDesc, cb);
        } else {
            errorMessageObj = {"error": "Group already exists"};
            processCreateGroup(err, errorMessageObj)
        }
    }

    function cb(err, createdMessageObj) {
        processCreateGroup(err, "Group created successfully")
    }
}

function updateGroup(oldGroupName, newGroupName, newGroupDesc, processUpdateGroup) {
    db.getGroupByName(newGroupName, processGetGroup);

    function processGetGroup(err, groupObj) {
        if (!groupObj.length) {
            db.updateGroup(oldGroupName, newGroupName, newGroupDesc, cb);
        } else {
            errorMessageObj = {"error": "Group already exists"};
            processUpdateGroup(err, errorMessageObj)
        }
    }

    function cb(err, updatedMessageObj) {
        processUpdateGroup(err, "Group with name" + oldGroupName +" was updated")
    }
}

function addSeriesToGroup(groupName, seriesObj, processAddSeriesToGroup) {
    db.getGroupByName(groupName, processGetGroup);

    function processGetGroup(err, groupObj) {
        if (!groupObj.length) {
            errorMessageObj = {"error": "Group doesn't exist"};
            processAddSeriesToGroup(err, errorMessageObj)
        } else
            db.addSeriesToGroup(groupName, seriesObj, cb)
    }

    function cb(err, updatedMessageObj) {
        processAddSeriesToGroup(err, updatedMessageObj)
    }
}


function deleteSeriesFromGroup(groupName, seriesName, processDeleteSeriesFromGroup) {
    db.getGroupByName(groupName, processGetGroup);

    function processGetGroup(err, groupObj) {
        if (!groupObj.length) {
            errorMessageObj = {"error": "Group doesn't exist"};
            processDeleteSeriesFromGroup(err, errorMessageObj)
        } else
            db.deleteSeriesFromGroup(groupName, seriesName, cb);
    }



    function cb(err, deletedMessageObj) {
        processDeleteSeriesFromGroup(0, deletedMessageObj)
    }
}



module.exports = {
    getPopularSeries: getPopularSeries,
    getSeriesWithId: getSeriesWithId,
    getSeriesWithName: getSeriesWithName,
    getAllGroups: getAllGroups,
    getGroupByName: getGroupByName,
    getSeriesBetweenInterval: getSeriesBetweenInterval,
    createGroup: createGroup,
    updateGroup: updateGroup,
    addSeriesToGroup: addSeriesToGroup,
    deleteSeriesFromGroup: deleteSeriesFromGroup
};