'use strict';
const seriesService = require('./cota-services');
const respCodes = [];
respCodes[seriesService.RESOURCE_FOUND_MSG] = 200;
respCodes[seriesService.RESOURCE_NOT_FOUND_MSG] = 404;
respCodes[seriesService.GROUP_CREATED_MSG] = 201;
respCodes[seriesService.GROUP_CONFLICT_MSG] = 409;
respCodes[seriesService.GROUP_UPDATED_MSG] = 200;
respCodes[seriesService.DB_ERROR_MSG] = 500;
respCodes[seriesService.API_ERROR_MSG] = 503;

function deserializeUser(user, done) {
    //console.log("deserializeUserCalled")
    done(null, user)
}
  
function serializeUser(user, done) {
    //console.log("serializeUserCalled")
    done(null, user)
}

function verifyAuthenticated(req, rsp) {
    rsp.json({result: req.isAuthenticated(), username: req.body.username})
}

function validateLogin(req, rsp) {
    validateUser(req.body.username, req.body.password)
        .then(() => {
            req.logIn({
                username: req.body.username
             }, (errObj) => rsp.json({result: true, username: req.body.username}))
        })
        .catch(() => {
            rsp.json({result: false, username: req.body.username})
        })
  
    function validateUser(username, password) { 
        return new Promise(function(resolve, reject) {
            gameService.getUser(username)
                .then(function (respObj) {
                    if (password == respObj.body.password)
                        resolve()
                    else
                        reject()
                })
                .catch(function (errObj) {
                    reject()
                })
        })
     }
}

function registerUser(req, rsp) {
    gameService.registerUser(req.body.username, req.body.password)
        .then(function (respObj) {
            rsp.statusCode = respObj.statusCode
            rsp.json(respObj)
        })
        .catch(function (errObj) {
            rsp.statusCode = errObj.statusCode
            rsp.json(errObj)
        })
}

function logout(req, rsp) {
    req.logOut()
    rsp.json({message: "Logged out."})
}

function getPopularSeries(req, rsp) {
    delegateTask(
        seriesService.getPopularSeries(req.params.page),
        rsp
    )
}

function getSeriesWithName(req, rsp) {
    delegateTask(
        seriesService.getSeriesWithName(req.params.seriesName),
        rsp
    )
}

function getAllGroups(req, rsp) {
    delegateTask(
        seriesService.getAllGroups(),
        rsp
    )
}

function getGroupByName(req, rsp) {
    delegateTask(
        seriesService.getGroupByName(req.params.groupName),
        rsp
    )
}

function createGroup(req, rsp) {
    delegateTask(
        seriesService.createGroup(req.body.name, req.body.desc),
        rsp
    )
}


function updateGroup(req, rsp) {
    delegateTask(
        seriesService.updateGroup(req.params.groupName, req.body.name, req.body.desc),
        rsp
    )
}

function addSeriesToGroup(req, rsp) {
    delegateTask(
        seriesService.addSeriesToGroup(req.params.groupName, req.body.series),
        rsp
    )
}

function deleteSeriesFromGroup(req, rsp) {
    delegateTask(
        seriesService.deleteSeriesFromGroup(req.params.groupName, req.params.seriesName),
        rsp
    )
}

function getSeriesBetweenInterval(req, rsp) {
    delegateTask(
        seriesService.getSeriesBetweenInterval(req.params.groupName, req.params.min, req.params.max),
        rsp
    )
}

function delegateTask(promise, rsp) {
    promise
        .then(result => {
            successResponse(rsp, result)
        })
        .catch(err => {
            errorResponse(rsp, err)
        });
}

function errorResponse(rsp, err) {
    rsp.statusCode = respCodes[err.short]
    rsp.json({error: err})
}

function successResponse(rsp, result) {
    rsp.statusCode = respCodes[result.short]
    rsp.json({success: result})
}

module.exports = {
    deserializeUser: deserializeUser,
    serializeUser: serializeUser,
    validateLogin: validateLogin,
    verifyAuthenticated: verifyAuthenticated,
    registerUser: registerUser,
    logout: logout,
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