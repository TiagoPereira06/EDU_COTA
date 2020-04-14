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

function getGroup(name,done ){

    for (let i = 0; i < Groups_Database.length; i++){
        if(i.name===name) return Groups_Database[i]
        else return null
    }

}

module.exports = {
    createGroup : createGroup,
    getGroup : getGroup
}

