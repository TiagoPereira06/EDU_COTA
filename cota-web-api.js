const seriesService = require('./cota-services');

module.exports = {
    getPopularSeries: getPopularSeries,
    getSeriesWithName: getSeriesWithName,
    getGroups: getGroups,
    getGroup: getGroup,
    getSeriesBetweenInterval:  getSeriesBetweenInterval, 
    createGroup: createGroup,
    updateGroup: updateGroup,
    addSeriesToGroup: addSeriesToGroup,
    deleteSeriesFromGroup: deleteSeriesFromGroup
};


function getPopularSeries(req, rsp) {
    seriesService.getPopularSeries(processGetPopularSeries,req.params.page);

    function processGetPopularSeries(err, popularSeriesObj) {
        rsp.statusCode = 200;
        rsp.end(JSON.stringify(popularSeriesObj))
    }
}

function getSeriesWithName(req, rsp) {
    seriesService.getSeriesWithId(req.params.seriesName, processGetSeriesWithName);

    function processGetSeriesWithName(err, seriesObj) {
        rsp.statusCode = 200;
        rsp.end(JSON.stringify(seriesObj))
    }
}

function getGroups(req, rsp) {
    seriesService.getGroups(processGetGroups);

    function processGetGroups(err, groupsObj) {
        rsp.statusCode = 200;
        rsp.end(JSON.stringify(groupsObj))
    }
}

function getGroup(req, rsp) {
    seriesService.getGroup(req.params.groupName, processGetGroup);

    function processGetGroup(err, groupObj) {

        if (!groupObj) {
            groupObj = {"error": "No group found"};
            rsp.statusCode = 404
        }
        else
            rsp.statusCode = 200;
            
        rsp.end(JSON.stringify(groupObj))
    }
}

function getSeriesBetweenInterval(req, rsp) {
    seriesService.getSeriesBetweenInterval(req.params.groupName, req.params.min, req.params.max, processGetSeriesBetweenInterval);

    function processGetSeriesBetweenInterval(err, seriesObj) {
        rsp.statusCode = 200;
        rsp.end(JSON.stringify(seriesObj))
    }
}

function createGroup(req, rsp) { //body
    seriesService.createGroup(req.body.name, req.body.desc, processCreateGroup);
  
    function processCreateGroup(err, createdMessageObj) {
        rsp.statusCode = 201;
        rsp.end(JSON.stringify(createdMessageObj))
    }
}

function updateGroup(req, rsp) {//params & body
    seriesService.updateGroup(req.params.groupName, req.body.name, req.body.desc, processUpdateGroup);

    function processUpdateGroup(err, updatedMessageObj) {
        rsp.statusCode = 200;
        rsp.end(JSON.stringify(updatedMessageObj))
    }
}

function addSeriesToGroup(req, rsp) {
    seriesService.getSeriesWithId(req.params.seriesId, processGetSeriesWithId);

    function processGetSeriesWithId(err, seriesObj) {
        seriesService.addSeriesToGroup(req.params.groupName, seriesObj[0], processAddSeriesToGroup)
    }

    function processAddSeriesToGroup(err, groupObj) {
        rsp.statusCode = 200;
        rsp.end(JSON.stringify(groupObj))
    }
}

function deleteSeriesFromGroup(req, rsp) {
    seriesService.getIndexOfSeriesInGroup(req.params.groupName, req.params.seriesId, processGetIndexOfSeriesInGroup);

    function processGetIndexOfSeriesInGroup(err, seriesIdx) {
        seriesService.deleteSeriesFromGroup(req.params.groupName, seriesIdx, processDeleteSeriesFromGroup)
    }

    function processDeleteSeriesFromGroup(err, deletedMessageObj) {
        rsp.statusCode = 200;
        rsp.end(JSON.stringify(deletedMessageObj))
    }
}