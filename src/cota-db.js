'use strict'

const Groups_Database = []

function createGroup(name, desc, processCreateGroup) {
    let group = {
        name: name,
        desc: desc,
        series : []
    }
    Groups_Database.push(group)
    console.log("Group inserted ----> " + group.name)
    processCreateGroup(null, console.log("Number of groups : " + Groups_Database.length))
}

function getGroupByName(name, processGetGroup) {
    //TODO : RETORNAR COM ARRAY DE SERIES
    let group = Groups_Database.filter(e => e.name === name)
    return processGetGroup(null, group)
}

function getGroups(processGetGroups) {
    return processGetGroups(null, Groups_Database)
}

function updateGroup(oldName,newName,newDesc,processGetGroups) {
    let index = Groups_Database.findIndex(group => group.name === oldName)
    Groups_Database[index].name = newName;
    Groups_Database[index].desc = newDesc;
    console.log("Group edited ----> " + oldName)
    return processGetGroups(null, console.log("OLD : " + oldName+" , NEW : "+newName));
}

function addSeriesToGroup(groupName, series, processAddSeriesToGroup){
    let index = Groups_Database.findIndex(group => group.name === groupName)
    Groups_Database[index].series.push(series);
    console.log("Group edited ----> " + groupName + " added " + series.name + " series !");
    return processAddSeriesToGroup(null, console.log("SUCCESS !"));
}
function deleteSeriesFromGroup(groupName, seriesName, processDeleteSeriesFromGroup){
    let groupIndex = Groups_Database.findIndex(group => group.name === groupName)
    let seriesArray = Groups_Database[groupIndex].series;
    Groups_Database[groupIndex].series = seriesArray.filter(series => series.name !== seriesName);
    console.log("\"Group edited ----> " + groupName + " deleted " + seriesName + " series !");
    return processDeleteSeriesFromGroup(null ,console.log("SUCCESS !"))
}
function getSeriesBetweenInterval(groupName, min, max, processgetSeriesBetweenInterval){
    let groupIndex = Groups_Database.findIndex(group => group.name === groupName)
    let seriesArray = Groups_Database[groupIndex].series
    let finalarray = seriesArray.filter(series => series.vote_average >= min && series.vote_average <= max)
    return processgetSeriesBetweenInterval(null,finalarray)
}

module.exports = {
    createGroup: createGroup,
    getGroupByName: getGroupByName,
    getGroups: getGroups,
    updateGroup: updateGroup,
    addSeriesToGroup: addSeriesToGroup,
    deleteSeriesFromGroup : deleteSeriesFromGroup,
    getSeriesBetweenInterval: getSeriesBetweenInterval
    }



