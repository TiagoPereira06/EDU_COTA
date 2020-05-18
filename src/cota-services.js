'use strict';
const webApi = require('./movie-database-data');
const db = require('./cota-db.js');
const utils = require('./cota-utils');

const RESOURCE_FOUND_MSG = "RESOURCE FOUND";
const RESOURCE_NOT_FOUND_MSG = "RESOURCE NOT FOUND";
const GROUP_CREATED_MSG = "GROUP CREATED";
const GROUP_CONFLICT_MSG = "DUPLICATE GROUP FOUND";
const GROUP_UPDATED_MSG = "GROUP UPDATED";
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
                    GROUP_CONFLICT_MSG
                )
            } else {
                return db.createGroup(groupName, groupDesc)
                    .then(result => {
                            if (result === "created")
                                return utils.success(
                                    `GROUP ${groupName} CREATED`,
                                    GROUP_CREATED_MSG,
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
                                                GROUP_UPDATED_MSG
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
                                GROUP_CONFLICT_MSG
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
                                                GROUP_UPDATED_MSG
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
                                                    GROUP_UPDATED_MSG
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
    RESOURCE_FOUND_MSG: RESOURCE_FOUND_MSG,
    RESOURCE_NOT_FOUND_MSG: RESOURCE_NOT_FOUND_MSG,
    GROUP_CREATED_MSG: GROUP_CREATED_MSG,
    GROUP_UPDATED_MSG: GROUP_UPDATED_MSG,
    GROUP_CONFLICT_MSG: GROUP_CONFLICT_MSG,
    DB_ERROR_MSG: DB_ERROR_MSG,
    API_ERROR_MSG: API_ERROR_MSG
};