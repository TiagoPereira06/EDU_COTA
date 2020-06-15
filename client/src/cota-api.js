'use strict';

function getPopularSeries(page) {
    return fetch(`/series/popular/${page}`)
        .then(response => {
            return response.json()
        });
}

function getSeriesWithName(seriesName) {
    return fetch(`/series/${seriesName}`)
        .then(response => {
            return response.json()
        });
}

function getAllPublicGroups() {
    return fetch(`/groups/public`)
        .then(response => {
            return response.json()
        });
}

function getGroups() {
    return fetch(`/groups`)
        .then(response => {
            return response.json()
        });
}

function getSharedGroups() {
    return fetch(`/groups/shared`)
        .then(response => {
            return response.json()
        });
}

function getGroupByName(groupName) {
    return fetch(`/groups/${groupName}`)
        .then(response => {
            return response.json()
        });
}

function getUser() {
    return fetch(`/users/current`)
        .then(response => {
            return response.json()
        });
}

function signIn(username, password) {
    return fetch('/users/signin', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({
            'username': username,
            'password': password
        })
    })
        .then(response => {
            return response.json()
        });
}

function logout() {
    return fetch('/users/logout', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        }
    })
        .then(() => {
            return "Successfully Logged Out"
        });
}

function signUp(username, password) {
    return fetch('/users/signup', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({
            'username': username,
            'password': password
        })
    })
        .then(response => {
            return response.json()
        });
}

module.exports = {
    getPopularSeries: getPopularSeries,
    getSeriesWithName: getSeriesWithName,
    getAllPublicGroups: getAllPublicGroups,
    getGroups: getGroups,
    getSharedGroups: getSharedGroups,
    getGroupByName: getGroupByName,
    signIn: signIn,
    signUp: signUp,
    logout: logout,
    getUser: getUser,

};