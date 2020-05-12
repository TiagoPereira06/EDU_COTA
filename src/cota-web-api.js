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

function getPopularSeries(req, rsp) {
     seriesService.getPopularSeries(req.params.page)
        .then(function(popularSeriesObj) {
            rsp.statusCode = 200
            rsp.json(popularSeriesObj)
         })
        .catch(function (err) {
            rsp.statusCode = err.statusCode
            rsp.json(err.body);
        });
}

function getSeriesWithName(req, rsp) {
    seriesService.getSeriesWithName(req.params.seriesName)
        .then(function (gamesObj) {
            rsp.statusCode = 200
            rsp.json(gamesObj)
        })
        .catch(function (err) {
            rsp.statusCode= err.statusCode
            rsp.json(err.body)
        });
    
}

function getAllGroups(req, rsp) {
    seriesService.getAllGroups()
        .then(function (groupsObj) {
            rsp.statusCode = 200;
            rsp.end(JSON.stringify(groupsObj))
        })
        .catch(function (err) {
            rsp.statusCode = err.statusCode
            rsp.json(err.body)
        })
}

function getGroupByName(req, rsp) {
    seriesService.getGroupByName(req.params.groupName)
        .then(function (groupObj) {
            rsp.statusCode=200
            rsp.json(groupObj)
        })
        .catch(function (err) {
            rsp.statusCode = err.statusCode
            rsp.json(err.body)
        })

   /*function processGetGroup(err, groupObj) {

        if (!groupObj) {
            groupObj = {"error": "No group found"};
            rsp.statusCode = 404
        } else
            rsp.statusCode = 200;

        rsp.end(JSON.stringify(groupObj))
    }
    */
}

function getSeriesBetweenInterval(req, rsp) {
    seriesService.getSeriesBetweenInterval(req.params.groupName, req.params.min, req.params.max)
        .then(function (SeriesObj) {
            rsp.statusCode= 200;
            rsp.json(SeriesObj)
        })
        .catch(function (err) {
            rsp.statusCode = err.statusCode
            rsp.json(err.body)
        })

    /*function processGetSeriesBetweenInterval(err, seriesObj) {
        if(req.params.min< 2 ||req.params.max >10 ){
            rsp.statusCode= 400
            rsp.end(JSON.stringify(seriesObj))
        }
        else {
            rsp.statusCode = 200;
            rsp.end(JSON.stringify(seriesObj))
        }
    }

     */
}

function createGroup(req, rsp) { //body
    seriesService.createGroup(req.body.name, req.body.desc)
        .then(function (createMessageObj) {
            rsp.statusCode =201
            rsp.json(createMessageObj)
        })
        .catch(function (err) {
            rsp.statusCode = err.statusCode
            rsp.json(err.body)
        })

 /*   function processCreateGroup(err, createdMessageObj) {
        if(createdMessageObj.error) rsp.statusCode = 403;
            else rsp.statusCode = 201;
        rsp.end(JSON.stringify(createdMessageObj))
    }
    */

}

function updateGroup(req, rsp) {//params & body
    seriesService.updateGroup(req.params.groupName, req.body.name, req.body.desc)
        .then(function (updatedMessageObj) {
            rsp.statusCode = 200
            rso.json(updatedMessageObj)
        })
        .catch(function (err) {
            rsp.statusCode = err.statusCode
            rsp.json(err.body)
        })
}

function addSeriesToGroup(req, rsp) {
    seriesService.addSeriesToGroup(req.params.groupName, req.params.seriesName)
        .then(function(groupObj) {
            rsp.statusCode = 200
            rsp.json(groupObj)
        })
        .catch(function (err) {
            rsp.statusCode = err.statusCode
            rsp.json(err.body);
        });
}

function deleteSeriesFromGroup(req, rsp) {
    seriesService.deleteSeriesFromGroup(req.params.groupName, req.params.seriesName)
        .then(function (deletedMessageObj) {
            rsp.statusCode = 200
            rso.json(deletedMessageObj)
        })
        .catch(function (err) {
            rsp.statusCode = err.statusCode
            rsp.json(err.body)
        })
}