const seriesService = require('./cota-services');

module.exports = {
    getMostPopularSeries: getPopularSeries,
    getSeriesByName: getSeriesWithName,
    getAllGroups: getAllGroups,
    getGroupByName: getGroupByName,
    getSeriesBetweenInterval: getSeriesBetweenInterval,
    createGroup: createGroup,
    updateGroup: updateGroup,
    addSeriesToGroup: addSeriesToGroup,
    deleteSeriesFromGroup: deleteSeriesFromGroup
};

//TODO : Tratamento de Erros nas respostas!
function getPopularSeries(req, rsp) {
    seriesService.getPopularSeries(processGetPopularSeries, req.params.page);

    function processGetPopularSeries(err, popularSeriesObj) {
        rsp.statusCode = 200;
        rsp.end(JSON.stringify(popularSeriesObj))
    }
}

function getSeriesWithName(req, rsp) {
    seriesService.getSeriesWithName(req.params.seriesName, processGetSeriesWithName);

    function processGetSeriesWithName(err, seriesObj) {
        rsp.statusCode = 200;
        rsp.end(JSON.stringify(seriesObj))
    }
}

function getAllGroups(req, rsp) {
    seriesService.getAllGroups(processGetGroups);

    function processGetGroups(err, groupsObj) {
        rsp.statusCode = 200;
        rsp.end(JSON.stringify(groupsObj))
    }
}

function getGroupByName(req, rsp) {
    seriesService.getGroupByName(req.params.groupName, processGetGroup);

    function processGetGroup(err, groupObj) {

        if (!groupObj) {
            groupObj = {"error": "No group found"};
            rsp.statusCode = 404
        } else
            rsp.statusCode = 200;

        rsp.end(JSON.stringify(groupObj))
    }
}

function getSeriesBetweenInterval(req, rsp) {
    seriesService.getSeriesBetweenInterval(req.params.groupName, req.params.min, req.params.max, processGetSeriesBetweenInterval);

    function processGetSeriesBetweenInterval(err, seriesObj) {
        if(req.params.min< 2 ||req.params.max >10 ){
            rsp.statusCode= 400
            rsp.end(JSON.stringify(seriesObj))
        }
        else {
            rsp.statusCode = 200;
            rsp.end(JSON.stringify(seriesObj))
        }
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
    seriesService.getSeriesWithName(req.params.seriesName, processGetSeriesWithName);

    function processGetSeriesWithName(err, seriesObj) {
        seriesService.addSeriesToGroup(req.params.groupName, seriesObj[0], processAddSeriesToGroup)
    }

    function processAddSeriesToGroup(err, groupObj) {
        rsp.statusCode = 200;
        rsp.end(JSON.stringify(groupObj))
    }
}

function deleteSeriesFromGroup(req, rsp) {
    seriesService.deleteSeriesFromGroup(req.params.groupName, req.params.seriesName, processDeleteSeriesFromGroup)

    function processDeleteSeriesFromGroup(err, deletedMessageObj) {
        rsp.statusCode = 200;
        rsp.end(JSON.stringify(deletedMessageObj))
    }
}