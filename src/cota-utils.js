const request = require('request');

const SERVER_HOST = "localhost";
const SERVER_PORT = 8080;
const SERVER_URI = `http://${SERVER_HOST}:${SERVER_PORT}/`;

const ES_HOST = "localhost";
const ES_PORT = 9200;
const ES_URI = `http://${ES_HOST}:${ES_PORT}/`;

const API_URL_START = "https://api.themoviedb.org";
const API_KEY = '0c9b2502c13f4dcc2217113f2adf3788';
const language = 'en-US';

const MOCHA_TIMEOUT = 10000000;

function requestServerOptions(method, path, body) {
    if (body != null)
        return {
            'method': method,
            'uri': `${SERVER_URI}${path}`,
            'body': body,
            'json': true
        };
    else
        return {
            'method': method,
            'uri': `${SERVER_URI}${path}`,
            'json': true
        }
}

function requestDatabaseOptions(method, path, body) {
    return {
        'method': method,
        'uri': `${ES_URI}${path}`,
        'body': body,
        'json': true
    }
}

function refresh(beforeOrAfter) {
    beforeOrAfter(function (done) {
        // Replace 'groups' with parameter if more db indexes
        options = {
            'method': 'POST',
            'uri': `${ES_URI}groups/_refresh`,
            'json': true
        };
        request.post(options, (err, res, body) => {
            done()
        })
    })
}

function post(options, beforeOrAfter) {
    beforeOrAfter(function (done) {
        request.post(options, (err, res, body) => {
            done()
        })
    });

    refresh(beforeOrAfter)
}

function put(options, beforeOrAfter) {
    beforeOrAfter(function (done) {
        request.put(options, (err, res, body) => {
            done()
        })
    });

    refresh(beforeOrAfter)
}

function del(options, beforeOrAfter) {
    beforeOrAfter(function (done) {
        request.delete(options, (err, res, body) => {
            done()
        })
    });

    refresh(beforeOrAfter)
}

function getErrObj(code, message = "Service Unavailable") {
    switch (code) {
        case 503:
            return {
                'statusCode': 503,
                'body': {"status": message}
            };
        case 409:
            return {
                'statusCode': 409,
                'body': {"status": message}
            };
        case 404:
            return {
                'statusCode': 404,
                'body': {"status": message}
            }
    }
}

module.exports = {
    requestServerOptions: requestServerOptions,
    requestDatabaseOptions: requestDatabaseOptions,
    refresh: refresh,
    post: post,
    put: put,
    del: del,
    getErrObj: getErrObj,
    SERVER_PORT: SERVER_PORT,
    MOCHA_TIMEOUT: MOCHA_TIMEOUT,
    API_URL_START: API_URL_START,
    API_KEY: API_KEY,
    language: language
};