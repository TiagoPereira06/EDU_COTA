function GroupsApiUris() {
    const baseUri = "http://localhost/"

    this.getSeries       = (SeriesName)  => `${baseUri}series/${SeriesName}`
    this.getPopularSeries = () => `${baseUri}series/popular`
    this.getGroups   = () => `${baseUri}groups`
    this.getGroup        = (groupName) => `${baseUri}groups/${groupName}`
    this.createGroup     = () => `${baseUri}groups`
  //  this.deleteGroup     = (groupName) => `${baseUri}groups/${groupName}`
    this.addSeriesToGroup  = (groupName) => `${baseUri}groups/${groupName}/series/`
    this.deleteSeriesFromGroup = (groupName, SeriesName) => `${baseUri}groups/${groupName}/series/${SeriesName}`
    this.getGamesFromGroupBetween = (groupName, minPlaytime, maxPlaytime) => `${baseUri}groups/${groupName}/series/${min}&${max}`
    this.updateGroup     = (groupName) => `${baseUri}groups/${groupName}`
    this.login           = () => `${baseUri}login`
    this.logout          = () => `${baseUri}logout`
    this.register        = () => `${baseUri}register`
    this.auth            = () => `${baseUri}auth`
}
  
const apiUris = new GroupsApiUris();

function getSeries(gameName) {
    return fetch(apiUris.getGames(gameName)).then(respObj => respObj.json())
}

function getPopularSeries() {
    return fetch(apiUris.getPopularGames()).then(respObj => respObj.json())
}
  
function getGroups() {
    return fetch(apiUris.getGroups()).then(respObj => respObj.json())
}
  
function getGroup(groupName) {
    return fetch(apiUris.getGroup(groupName)).then(respObj => respObj.json())
}

function createGroup(groupName, groupDesc) {
    return fetch(apiUris.createGroup(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "name": groupName,
            "desc": groupDesc
        })
    })
    .then(function(respObj) {
        if (respObj.status != 201)
            return respObj.json().then(errObj => Promise.reject(errObj.message))
        else
            return respObj.json()
    })
}

function deleteGroup(groupName) {
    return fetch(apiUris.deleteGroup(groupName), {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(function(respObj) {
        if (respObj.status != 200)
            return respObj.json().then(errObj => Promise.reject(errObj.message))
        else
            return respObj.json()
    })
}

function addSeriesToGroup(groupName, SeriesName) {
    return fetch(apiUris.addSeriesToGroup(groupName, SeriesName), {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(function(respObj) {
        if (respObj.status != 201) 
            return respObj.json().then(errObj => Promise.reject(errObj.message))
        else
            return respObj.json()
    })
}

function deleteSeriesFromGroup(groupName, SeriesName) {
    return fetch(apiUris.deleteGameFromGroup(groupName, SeriesName), {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(function(respObj) {
        if (respObj.status != 200) 
            return respObj.json().then(errObj => Promise.reject(errObj.message))
        else
            return respObj.json()
    })
}

function getSeriesFromGroupBetween(groupName, min, max) {
    return fetch(
        apiUris.getGamesFromGroupBetweenPlaytime(groupName, min, max)
    ).then(respObj => respObj.json())
}

function updateGroup(oldGroupName, newGroupName, newGroupDesc) {
    return fetch(apiUris.updateGroup(oldGroupName), {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "name": newGroupName,
            "desc": newGroupDesc
        })
    })
    .then(function(respObj) {
        if(respObj.status != 200)
            return respObj.json().then(errObj => Promise.reject(errObj.message))
        else
            return respObj.json()
    })
}

function login(username, password) {
    return fetch(apiUris.login(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "username": username,
            "password": password
        })
    }).then(respObj => respObj.json())
}

function logout() {
    return fetch(apiUris.logout(), {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(respObj => respObj.json())
}

function registerUser(username, password) {
    return fetch(apiUris.register(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "username": username,
            "password": password
        })
    })
    .then(function(respObj) {
        if (respObj.status != 201)
            return respObj.json().then(errObj => Promise.reject(errObj.message))
        else
            return respObj.json()
    })
}

// Returns true or false
function isAuthenticated() {
    return fetch(apiUris.auth()).then(respObj => respObj.json())
}