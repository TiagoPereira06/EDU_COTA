'use strict'

const Groups_Database = []

function createGroup(name,desc,processCreateGroup) {
    let group = {
        name : name,
        desc : desc
    }
        Groups_Database.push(group)
        console.log("Group inserted  ---->   " + group.name)

        processCreateGroup(null,console.log("Number of groups :  " + Groups_Database.length))
}

function getGroup(name,processgetGroup){ // auxiliar

     let group = Groups_Database.filter(e => e.name === name)
     return processgetGroup(null,group)
}
function getGroups(processgetGroups){
   return processgetGroups(null, Groups_Database)
}

module.exports = {
    createGroup : createGroup,
    getGroup : getGroup,
    getGroups : getGroups
}

