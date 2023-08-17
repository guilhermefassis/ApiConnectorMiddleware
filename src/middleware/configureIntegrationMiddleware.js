const axios = require('axios');

var apiConfig = {
    'apiName': '',
    'apiUrl': '',
    'apiRoute': '',
    'apiVerb': 'GET',
    'queryString': '',
    'headers': ''
}

function createApiConfig(apiConfiguration) {
    apiConfig = apiConfiguration;
}

function integrationMiddleware(req, res, next) {
    req.apiConfig = apiConfig;
    if(req.apiConfig.apiVerb && req.apiConfig.apiVerb === 'GET') {
        const request = createRequest(req.apiConfig);
        request.get()
            .then(response => {
                console.log(response.data);
                req.integrationData = response.data;
                next();
            })
            .catch(error => {
                console.log(error.message)
            });
    }
}

function createRequest(apiCallConfiguration) {
    const defaultConfig = {
        baseURL: apiCallConfiguration.apiUrl + apiCallConfiguration.apiRoute + apiCallConfiguration.queryString,
        headers: apiCallConfiguration.headers,
        timeout: 10000
    }
    const request = axios.create(defaultConfig);
    return request;
}

module.exports = {
    integrationMiddleware,
    createApiConfig
}