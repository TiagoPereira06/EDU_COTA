const webapi = require('./movie-database-data');
const db = require('./cota-db.js');

function getPopularSeries(page) {
    return webapi.getPopularSeries(page)
}

function getSeriesWithId(seriesName) {
   return webapi.getSeriesWithId(seriesName)
}


function getSeriesWithName(seriesName) {
    return webapi.getSeriesWithName(seriesName)
}

function getAllGroups() {
    db.getGroups();
}

function getGroupByName(groupName) {
    db.getGroupByName(groupName);
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

function createGroup(groupName, groupDesc) {
    return db.getGroupByName(groupName)
        .then(groupObj => {
            if(groupObj) return Promise.reject(utils.getErrObj(409,"Group already exists"))
        })
        .catch(err => {
            if (err.statusCode === 404)
                return db.createGroup(groupName,groupDesc)
            return Promise.reject(err)
        })
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

    function cb(err) {
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