window.addEventListener("load", pageLoad)
window.addEventListener('hashchange', processHashChange)

register('series/popular', showPopularSeries)
register('series/search/:SeriesName', showSearch)
register('series/:SeriesName', showSeries)
register('groups', showGroups)
register('groups/:groupName', showGroup)

const MAX_GROUP_NAME_LENGTH = 15
const MAX_GROUP_DESC_LENGTH = 80
const ALERT_DELAY_TIMER = 1500

function pageLoad() {

   
    let body = document.body
    body.innerHTML += alertSuccessTemplate()
    body.innerHTML += alertDangerTemplate()
    $(body.querySelector(".alert-success")).hide()
    $(body.querySelector(".alert-danger")).hide()
    
    let content = document.querySelector("#content")
    processHashChange()
}

function processHashChange() {
    isAuthenticated().then(function(respObj) {
        if (respObj.result) {
            $(function() {
                $("#searchSeriesBtn").click(function(e) {
                    window.location.hash = `series/search/${$('#searchSeriesInput').val()}`
                });
                $("#logoutBtn").click(function(e) {
                    logout().then(respObj => location.reload())
                });
            });
            document.querySelector('#navbar').innerHTML = navbarTemplate()
            const hash = window.location.hash.substring(1)
            if (hash == '')
                window.location.hash = "groups"
            else {
                handler = getHandler(hash)
                handler.handler(handler.params)
            }
        }
        else if (window.location.hash) 
            window.location.href = ""

        // No hash, go back home
        else 
            showHome()
    })
}

function showHome() {
    showHomeView()

    function showHomeView() {
        document.title = "COTA"
        document.querySelector('#content').innerHTML = loginTemplate()

        inLoginScreen = true // false => in register screen

        document.querySelector('.helper').addEventListener('click', function() {
            $('#usernameInput').val('')
            $('#passwordInput').val('')
            if (inLoginScreen) {
                document.querySelector('.login100-form-btn').textContent = 'Register'
                document.querySelector('#bottom-text').innerHTML = 'Already have an account? Login'
                inLoginScreen = !inLoginScreen
            } else {
                document.querySelector('.login100-form-btn').textContent = 'Login'
                document.querySelector('#bottom-text').innerHTML = 'Don\'t have an account? Register'
                inLoginScreen = !inLoginScreen
            }
        })

        document.querySelector('.login100-form-btn').addEventListener('click', function() {
            usernameVal = $('#usernameInput').val()
            passwordVal = $('#passwordInput').val()
            if (usernameVal == '' || passwordVal == '') 
                showAlert('Please fill out all inputs.', false)

            if (inLoginScreen) {
                login(usernameVal, passwordVal)
                    .then(function(respObj) {
                        if (respObj.result)
                            window.location.hash = "groups"
                        else
                            showAlert("Invalid username or password.", false)
                    })
            } else {
                registerUser(usernameVal, passwordVal)
                    .then(function (respObj) {
                        showAlert(respObj.message, true)
                        document.querySelector('.login100-form-btn').textContent = 'Login'
                        document.querySelector('#bottom-text').innerHTML = 'Don\'t have an account? Register'
                        inLoginScreen = !inLoginScreen
                        $('#passwordInput').val('')
                    })
                    .catch(errMessage => showAlert(errMessage, false))
            }
        })
    }
}

function showSearch(params) {
    showSearchView(params.SeriesName)

    function showSearchView(gameName) {
        document.title = SeriesName
            $('#searchSeriesInput').val('') // clear input
            if (SeriesName.length > 0) {
                $('#content').html('')
                showGames(gameName)
            }
            if (gameName.length <= 0) 
                showAlert("Search input cannot be empty.", false)
    }
}

function showPopularSeries() {
    getPopularSeries().then(showPopularGamesView)

    function showPopularGamesView(respObj) {
        document.title = "Popular"
        content.innerHTML = popularSeriesTemplate(respObj.body)
    }
}

function showSeries(params) {
    getSeries(params.SeriesName).then(showSeriesView)

    function showSeriesView(respObj) {
        series = respObj.body
        document.title = series[0].name
        content.innerHTML = seriesTemplate(series[0])
        getGroups()
            .then(function(respObj) {
                if (respObj.statusCode != 200) 
                    return // No groups

                content.innerHTML += listGroupsTemplate(respObj.body)
                content.querySelector('#seriesInfoFooter').innerHTML += addSeriesToGroupBtnTemplate()

                modal = content.querySelector('#listGroupsModal')

                modal.querySelectorAll('#groupName').forEach(groupName => {
                        groupName.addEventListener('click', function() {
                            addSeriesToGroup(groupName.textContent) //, params.SeriesName)
                                .then(respObj => showAlert(respObj.message, true))
                                .catch(errMessage => showAlert(errMessage, false))
                        })
                })
            })
    }
}

function showSeries(SeriesName) {
    getGames(SeriesName).then(showSeriesView)

    function showSeriesView(respObj) {
        series = respObj.body
        var table = content.querySelector('.table')
        if (table == null)
            content.insertAdjacentHTML('beforeend', seriesTemplate(series))
        else 
            table.innerHTML = seriesTemplate(series)
    }
}

function showGroups() {
    getGroups().then(showGroupsView)
    
    function showGroupsView(respObj) {
        groups = respObj.body
        document.title = "Groups"

        // Error
        if (respObj.statusCode != 200)
            groups = {}

        content.innerHTML = groupsTemplate({groups, username: respObj.username})
        document.querySelector('.content-box').innerHTML += addGroupTemplate({MAX_GROUP_NAME_LENGTH, MAX_GROUP_DESC_LENGTH})

        const createGroupBtn = document.querySelector('#createGroupBtn')
        const table = content.querySelector('.table')
        const loadingUpdatedGroups = document.querySelector('#loading')
        const groupName = content.getElementsByTagName('input')[0]
        const groupDesc = content.getElementsByTagName('input')[1]

        const rows = table.querySelectorAll('tr');
        const rowsArray = Array.from(rows);
        rowsArray.shift() // removes the table headers
         
        groups.table = table

        rowsArray.forEach(e => {
            e.querySelectorAll('td').forEach(data => {
                trashbin = data.querySelector('#deleteGroup') 
                if (trashbin)
                    trashbin.addEventListener('click', function() {
                        processDeleteGroupBtn(e.querySelector('#groupNameHref').text, groups, loadingUpdatedGroups)
                    })
            })
        })  

        createGroupBtn.addEventListener('click', () => {
            if (groupName.value.length > 0 && groupDesc.value.length > 0 && 
                groupName.value.length <= MAX_GROUP_NAME_LENGTH && groupDesc.value.length <= MAX_GROUP_DESC_LENGTH) {
                createGroup(groupName.value, groupDesc.value)
                    .then( (respObj) => {
                        updateGroupsTable({groupName: groupName.value, groupDesc: groupDesc.value}, groups, loadingUpdatedGroups, true)
                        groupName.value = ""
                        groupDesc.value = ""
                    })
                    .catch(errMessage => showAlert(errMessage, false))
            }
            else if (groupName.value.length > MAX_GROUP_NAME_LENGTH || groupDesc.value.length > MAX_GROUP_DESC_LENGTH) 
                showAlert("Name or description exceeds maximum size.", false)
            else 
                showAlert("Please fill out all form fields.", false)
            
        })
    }
}

function showGroup(params) {
    getGroup(params.groupName).then(showGroupView)

    function showGroupView(respObj) {
        group = respObj.body           
        document.title = group.name
        content.innerHTML = groupTemplate(group)   
        content.innerHTML += editGroupModalTemplate({name: group.name, desc: group.desc})

        if (group.games.length > 0) {
            content.innerHTML += filterBetweenPlaytimeModalTemplate()
            content.querySelector('#groupBtns').innerHTML += filterBetweenBtnTemplate()
        }
        
        content.querySelector('#applyEditGroupBtn')
            .addEventListener('click', function() {
                groupNameVal = $('#editGroupNameInput').val()
                groupDescVal = $('#editGroupDescInput').val()

                // if the user didn't change anything in the group details
                if ((group.name == groupNameVal && group.desc == groupDescVal) ||
                    (groupNameVal == '' || groupDescVal == '')) {
                    showAlert('Given parameters are equal or empty.', false)
                    return
                } else {
                    updateGroup(group.name, groupNameVal, groupDescVal)
                        .then(function() {
                            // Wait until it changes and avoid page reload
                            check()
                            function check() {
                                getGroup(groupNameVal)
                                    .then(function(respObj) {
                                        if (respObj.body.name != groupNameVal || respObj.body.desc != groupDescVal)
                                            check()
                                        else {
                                            $('#editGroupModal').modal('toggle')
                                            $('#groupDescLabel').text(groupDescVal)
                                            window.location.hash = `groups/${groupNameVal}`
                                            showAlert('Group edited successfully.', true)
                                        }
                                    })
                                    .catch(errObj => check())
                            }
                        })
                }
            })

        if (group.series.length > 0) {
            content.querySelector('#applyPlaytimeFilterBtn')
                .addEventListener('click', function() {
                    maxVal = $('#maxInput').val()
                    minVal = $('#minInput').val()
                    $('#filterBetweenModal').modal('toggle')

                    getSeriesFromGroupBetweenPlaytime(group.name, minVal, maxVal)
                        .then(function(respObj) {
                            series = respObj.body
                            if (series.statusCode != 200) 
                                return // No series

                            seriesToRemove = group.series.filter(o => !series.some(v => v.name === o.name))
                            seriesToRemove.forEach(g => {
                                deleteGameRow(group.table, {SeriesName: g.name})
                            })
                            if (seriesToRemove) {
                                filterBtn = content.querySelector('#filterBetweenBtn')
                                filterBtn.innerHTML = `<i class="fas fa-long-arrow-alt-left"></i>`
                                $(filterBtn).removeAttr('data-toggle')
                                filterBtn.addEventListener('click', function() {
                                    location.reload()
                                })
                            }
                        })
                })
        }

        group.table = content.querySelector('.table')  

        const loadingUpdatedSeries = document.querySelector('#loading')
        const rows = group.table.querySelectorAll('tr');
        const rowsArray = Array.from(rows);
        rowsArray.shift() // removes the table headers

        rowsArray.forEach(e => {
            e.querySelectorAll('td').forEach(data => {
                trashbin = data.querySelector('#deleteSeries') 
                if (trashbin)
                    trashbin.addEventListener('click', function() {
                        processDeleteSeriesBtn(e.querySelector('#seriesNameHref').text, group, loadingUpdatedSeries)
                    })
            })
        })
    }
}

function processDeleteGroupBtn(groupName, groups, loadingUpdatedGroups) {
    deleteGroup(groupName)
        .then(respObj => updateGroupsTable({groupName}, groups, loadingUpdatedGroups, false))
        .catch(errMessage => showAlert(errMessage, false))
}

function processDeleteSeriesBtn(SeriesName, group, loadingUpdatedGames) {
    deleteSeriesFromGroup(group.name, SeriesName)
        .then(respObj => updateGamesTable({SeriesName}, group, loadingUpdatedGames, false))
        .catch(errMessage => showAlert(errMessage, false))
}

// create = true -> create group
// create = false -> delete group
function updateGroupsTable(group, groups, spinner, createOrDelete) {
    spinner.style.visibility = "visible"
    check()
    function check() {
        getGroups().then(function(respObj) {
            var updatedGroups = respObj.body
            if (JSON.stringify(updatedGroups) === JSON.stringify(groups))
                check()
            else {
                if (createOrDelete) {
                    insertGroupRow(groups.table, {groupName: group.groupName, groupDesc: group.groupDesc}, groups, spinner)
                    showAlert("Group created successfully.", true)
                }
                else {
                    deleteGroupRow(groups.table, {groupName: group.groupName})
                    showAlert("Group deleted successfully.", true)
                }
                spinner.style.visibility = "hidden"
            }
        })
        .catch(errMessage => {})
    }
}

// create = true -> create group
// create = false -> delete group
function updateGamesTable(series, group, spinner, createOrDelete) {
    spinner.style.visibility = "visible"
    check()
    function check() {
        getGroup(group.name).then(function(respObj) {
            var updatedGroup = respObj.body

            if (JSON.stringify(updatedGroup.series) === JSON.stringify(group.series))
                check()
            else {
                if (createOrDelete) {
                    // Might be useful if we ever want to add a series to a group in the group's page
                    // insertSeriesRow(...)
                    // showAlert("Series inserted successfully.", true)
                }
                else {
                    deleteSeriesRow(group.table, {SeriesName: series.SeriesName})
                    showAlert("Series deleted successfully.", true)
                }
                spinner.style.visibility = "hidden"
            }
        })
        .catch(errMessage => { })
    }
}

function insertGroupRow(table, content, groups, spinner) {
    tbody = table.querySelector('tbody')
    row = tbody.insertRow(tbody.rows.length)
    cellName = row.insertCell(0)
    cellDesc = row.insertCell(1)
    cellGames = row.insertCell(2)
    cellAction = row.insertCell(3)
    
    cellName.innerHTML = `<a href="#groups/${content.groupName}">${content.groupName}</a>`
    cellName.id = `groupName`
    cellDesc.innerHTML = content.groupDesc
    cellGames.innerHTML = 0
    cellAction.innerHTML = `<i id="deleteGroup" class="fas fa-trash" style="color:red; cursor:pointer;"></i>`

    cellAction.querySelector('#deleteGroup').addEventListener('click', function() {
        processDeleteGroupBtn(content.groupName, groups, spinner)
    })
}

function deleteGroupRow(table, content) {
    tbody = table.querySelector('tbody')
    const rows = table.querySelectorAll('tr');
    const rowsArray = Array.from(rows);
    rowsArray.shift()

    rowsArray.forEach(row => {
        Array.from(row.children).forEach(td => {
            if (td.id == "groupName" && td.textContent == content.groupName)
                tbody.deleteRow(row.sectionRowIndex)
        })
    })
}

function insertGameRow(table, content, group, spinner) {
    // Might be useful if we ever want to add a series to a group in the group's page
}

function deleteSeriesRow(table, content) {
    tbody = table.querySelector('tbody')
    const rows = table.querySelectorAll('tr');
    const rowsArray = Array.from(rows);
    rowsArray.shift()

    rowsArray.forEach(row => {
        Array.from(row.children).forEach(td => {
            if (td.id == "SeriesName" && td.textContent.trim() == content.SeriesName)
                document.querySelector('tbody').deleteRow(row.sectionRowIndex)
        })
    })
}

function showAlert(message, success) {
    if (success)
        alert = document.querySelector('body').querySelector(".alert-success")
    else
        alert = document.querySelector('body').querySelector(".alert-danger")

    alertMessage = alert.querySelector("#alert-message")
    alertMessage.innerHTML = message 
    $(alert).show()
    $(alert).delay(ALERT_DELAY_TIMER)
    $(alert).fadeOut("slow")
}