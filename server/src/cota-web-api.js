'use strict';
const seriesService = require('./cota-services');
const auth = require('./cota-auth');
const respCodes = [];
respCodes[seriesService.RESOURCE_FOUND_MSG] = 200;
respCodes[seriesService.RESOURCE_NOT_FOUND_MSG] = 404;
respCodes[seriesService.GROUP_CREATED_MSG] = 201;
respCodes[seriesService.USER_CREATED_MSG] = 201;
respCodes[seriesService.GROUP_CONFLICT_MSG] = 409;
respCodes[seriesService.USER_CONFLICT_MSG] = 409;
respCodes[seriesService.GROUP_UPDATED_MSG] = 200;
respCodes[seriesService.DB_ERROR_MSG] = 500;
respCodes[seriesService.API_ERROR_MSG] = 503;

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

/*function getUser(req, rsp) {
    delegateTask(
        seriesService.getUser(req.params.username),
        rsp
    )
}*/

function login(req, res) {
    const userinfo = req.body;
    const username = userinfo.username;
    const password = userinfo.password;
    auth.getUser(username, password)
        .then(user => login(req, user))
        .then(() => res.json({user: username}))
        .catch(err => res.status(401).send({error: err}));

function login(req, user) {
    return new Promise((resolve, reject) => {
        req.login(user, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}
}

function logout(req, res) {
    req.logout();
    res.send();
}

function getUser(req, res) {
    const username = req.isAuthenticated() && req.user.username;

    if (username) {
        res.json({user: username});
    } else {
        res.status(404).send();
    }
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
    getUser: getUser,
    login: login,
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