'use strict';
const webApi = require('./movie-database-data');
const db = require('./cota-db.js');
const utils = require('./cota-utils');
const auth = require('./cota-auth');

const RESOURCE_FOUND_MSG = "RESOURCE FOUND";
const RESOURCE_NOT_FOUND_MSG = "RESOURCE NOT FOUND";
const RESOURCE_CREATED_MSG = "RESOURCE CREATED";
const RESOURCE_CONFLICT_MSG = "DUPLICATE RESOURCE FOUND";
const RESOURCE_UPDATED_MSG = "GROUP UPDATED";
const RESOURCE_UNAUTHORIZED_MSG = "RESOURCE UNAUTHORIZED";
const DB_ERROR_MSG = "ERROR IN DB";
const API_ERROR_MSG = "ERROR IN MOVIEDATABASE API";

function getPopularSeries(page) {
    return webApi.getPopularSeries(page)
        .then(seriesObj => {
            if (seriesObj) {
                return utils.success(
                    `MOST POPULAR SERIES SUCCESSFULLY RETRIEVED`,
                    RESOURCE_FOUND_MSG,
                    seriesObj,
                )
            }
            return utils.error(
                `ERROR AT FETCHING POPULAR SERIES`,
                RESOURCE_NOT_FOUND_MSG
            )
        })
        .catch(err => {
                return errorInvoke(err, API_ERROR_MSG)
            }
        )
}

function getSeriesByName(seriesName) {
    return webApi.getSeriesWithName(seriesName)
        .then(seriesObj => {
            if (seriesObj) {
                return utils.success(
                    `SERIES ${seriesName} FOUND`,
                    RESOURCE_FOUND_MSG,
                    seriesObj
                )
            } else {
                return utils.error(
                    `CANNOT FIND ${seriesName} SERIES`,
                    RESOURCE_NOT_FOUND_MSG
                )
            }
        })
        .catch(err => {
                return errorInvoke(err, API_ERROR_MSG)
            }
        )
}

function getAllGroups() {
    return db.getGroups()
        .then(allGroups => {
                return utils.success(
                    "ALL GROUPS REGISTERED",
                    RESOURCE_FOUND_MSG,
                    allGroups
                )
            }
        )
        .catch(err => {
                return errorInvoke(err, DB_ERROR_MSG);
            }
        )
}

function getGroupByName(groupName) {
    return db.getGroupByName(groupName)
        .then(groupObj => {
            if (groupObj) {
                return utils.success(
                    `GROUP ${groupName} FOUND`,
                    RESOURCE_FOUND_MSG,
                    groupObj
                )
            }
            return utils.error(
                `GROUP ${groupName} NOT FOUND`,
                RESOURCE_NOT_FOUND_MSG
            )
        })
        .catch(err => {
                return errorInvoke(err, DB_ERROR_MSG);
            }
        )
}

function createGroup(groupName, groupDesc) {
    return db.getGroupByName(groupName)
        .then(replyObj => {
            if (replyObj) {
                return utils.error(
                    `GROUP ${groupName} ALREADY EXISTS`,
                    RESOURCE_CONFLICT_MSG
                )
            } else {
                return db.createGroup(groupName, groupDesc)
                    .then(result => {
                            if (result === "created")
                                return utils.success(
                                    `GROUP ${groupName} CREATED`,
                                    RESOURCE_CREATED_MSG,
                                    result
                                )
                        }
                    )
            }
        })
        .catch(err => {
                return errorInvoke(err, DB_ERROR_MSG);
            }
        )
}


function updateGroup(oldGroupName, newGroupName, newGroupDesc) {
    return db.getGroupByName(oldGroupName)
        .then(oldGroup => {
            if (oldGroup) {
                return db.getGroupByName(newGroupName)
                    .then(newGroup => {
                        if (!newGroup) {
                            return db.updateGroup(oldGroupName, newGroupName, newGroupDesc)
                                .then(result => {
                                        if (result) {
                                            return utils.success(
                                                `GROUP ${oldGroupName} UPDATED`,
                                                RESOURCE_UPDATED_MSG
                                            )
                                        } else return utils.error(
                                            `PROBLEM UPDATING ${oldGroupName} GROUP`,
                                            DB_ERROR_MSG
                                        )
                                    }
                                )
                        } else {
                            return utils.error(
                                `GROUP ${newGroupName} ALREADY EXISTS`,
                                RESOURCE_CONFLICT_MSG
                            )
                        }
                    })

            } else {
                return utils.error(
                    `GROUP ${oldGroupName} NOT FOUND`,
                    RESOURCE_NOT_FOUND_MSG
                )
            }
        })
        .catch(err => {
            return errorInvoke(err, DB_ERROR_MSG);
        })
}

function addSeriesToGroup(groupName, seriesName) {
    return db.getGroupByName(groupName)
        .then(group => {
                if (group) {
                    return webApi.getSeriesWithName(seriesName)
                        .then(series => {
                            if (series) {
                                return db.addSeriesToGroup(groupName, series[0])
                                    .then(updated => {
                                        if (updated) {
                                            return utils.success(
                                                `ADDED ${seriesName} SERIES ${groupName} GROUP`,
                                                RESOURCE_UPDATED_MSG
                                            )
                                        } else {
                                            return utils.error(
                                                `PROBLEM ADDING ${seriesName} TO ${groupName} GROUP `,
                                                DB_ERROR_MSG
                                            )
                                        }
                                    })

                            } else {
                                return utils.error(
                                    `SERIES ${seriesName} NOT FOUND`,
                                    RESOURCE_NOT_FOUND_MSG
                                )
                            }
                        })
                } else {
                    return utils.error(
                        `GROUP ${groupName} NOT FOUND`,
                        RESOURCE_NOT_FOUND_MSG
                    )
                }
            }
        )
        .catch(err => {
            return errorInvoke(err, DB_ERROR_MSG);
        })
}

function deleteSeriesFromGroup(groupName, seriesName) {
    return db.getGroupByName(groupName)
        .then(group => {
                if (group) {
                    return db.getSeriesIdByGroupName(groupName, seriesName)
                        .then(seriesIndex => {
                                if (seriesIndex !== -1) {
                                    return db.deleteSeriesFromGroup(groupName, seriesIndex)
                                        .then(update => {
                                            if (update) {
                                                return utils.success(
                                                    `REMOVED ${seriesName} FROM ${groupName}`,
                                                    RESOURCE_UPDATED_MSG
                                                )
                                            } else {
                                                return utils.error(
                                                    `PROBLEM DELETING ${seriesName} FROM ${groupName} GROUP `,
                                                    DB_ERROR_MSG
                                                )
                                            }
                                        })
                                } else {
                                    return utils.error(
                                        `SERIES ${seriesName} NOT FOUND AT ${groupName}`,
                                        RESOURCE_NOT_FOUND_MSG
                                    )
                                }
                            }
                        )
                } else {
                    return utils.error(
                        `GROUP ${groupName} NOT FOUND`,
                        RESOURCE_NOT_FOUND_MSG
                    )
                }
            }
        )
        .catch((err) => {
            return errorInvoke(err, DB_ERROR_MSG);
        })
}

function getSeriesBetweenInterval(groupName, min, max) {
    return getGroupByName(groupName)
        .then(series => {
            return utils.success(
                `SERIES FROM ${groupName} VOTES BETWEEN ${min} and ${max}`,
                RESOURCE_FOUND_MSG,
                series.data.series.filter(obj => obj.vote_average > parseInt(min) && obj.vote_average < parseInt(max))
            )
        })
}

function getUserByName(username) {
    return db.getUserByName(username)
        .then(userObj => {
            if (userObj) {
                return utils.success(
                    `USER ${username} FOUND`,
                    RESOURCE_FOUND_MSG,
                    userObj
                )
            }
            return utils.error(
                `USER ${username} NOT FOUND`,
                RESOURCE_NOT_FOUND_MSG
            )
        })
        .catch(err => {
                return errorInvoke(err, DB_ERROR_MSG);
            }
        )
}

function createUser(username, password) {
    return db.getUserByName(username)
        .then(userObj => {
            if (userObj) {
                return utils.error(
                    `USER ${username} ALREADY EXISTS`,
                    RESOURCE_CONFLICT_MSG
                )
            } else {
                return db.createUser(username, password)
                    .then(result => {
                            if (result === "created")
                                return utils.success(
                                    `USER ${username} CREATED`,
                                    RESOURCE_CREATED_MSG,
                                    result
                                )
                        }
                    )
            }
        })
        .catch(err => {
                return errorInvoke(err, DB_ERROR_MSG);
            }
        )
}

function login(request) {
//TODO : MOVE LOGIN FROM API TO SERVICES
    const requestBody = request.body;
    const username = requestBody.username;
    const password = requestBody.password;
    return auth.checkValidUser(username, password)
        .then(foundUser => {
            return userLogin(request, foundUser)
                .then(() => {
                    return utils.success(
                        `USER ${username} FOUND`,
                        RESOURCE_FOUND_MSG,
                    )
                })
        }).catch(err => {
            return errorInvoke(err, DB_ERROR_MSG);
        })

}

function userLogin(req, user) {
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

function errorInvoke(err, msg) {
    if (err.short) return Promise.reject(err)
    else return utils.error(err, msg)
}

module.exports = {
    getPopularSeries: getPopularSeries,
    getSeriesWithName: getSeriesByName,
    getAllGroups: getAllGroups,
    getGroupByName: getGroupByName,
    getSeriesBetweenInterval: getSeriesBetweenInterval,
    createGroup: createGroup,
    updateGroup: updateGroup,
    addSeriesToGroup: addSeriesToGroup,
    deleteSeriesFromGroup: deleteSeriesFromGroup,
    getUserByName: getUserByName,
    createUser: createUser,
    login: login,
    RESOURCE_FOUND_MSG: RESOURCE_FOUND_MSG,
    RESOURCE_NOT_FOUND_MSG: RESOURCE_NOT_FOUND_MSG,
    RESOURCE_CREATED_MSG: RESOURCE_CREATED_MSG,
    RESOURCE_UPDATED_MSG: RESOURCE_UPDATED_MSG,
    RESOURCE_CONFLICT_MSG: RESOURCE_CONFLICT_MSG,
    RESOURCE_UNAUTHORIZED_MSG: RESOURCE_UNAUTHORIZED_MSG,
    DB_ERROR_MSG: DB_ERROR_MSG,
    API_ERROR_MSG: API_ERROR_MSG,
};