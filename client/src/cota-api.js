'use strict';

function getPopularSeries(page) {
    return fetch(`http://localhost:8080/series/popular/${page}`)
        .then(response => {
            return response.json()
        });
}

function getSeriesWithName(seriesName) {
    return fetch(`http://localhost:8080/series/${seriesName}`)
        .then(response => {
            return response.json()
        });
}

function getAllGroups() {
    return fetch(`http://localhost:8080/groups`)
        .then(response => {
            return response.json()
        });
}

function getGroupByName(groupName) {
    return fetch(`http://localhost:8080/groups/${groupName}`)
        .then(response => {
            return response.json()
        });
}

function getUser() {
    return fetch(`http://localhost:8080/users/user`)
        .then(response => {
            return response.json()
        });
}

function signIn(username, password) {
    return fetch('http://localhost:8080/users/signin', {
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
    return fetch('http://localhost:8080/users/logout', {
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
    return fetch('http://localhost:8080/users/signup', {
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
    getAllGroups: getAllGroups,
    getGroupByName: getGroupByName,
    signIn: signIn,
    signUp: signUp,
    logout: logout,
    getUser: getUser,

};