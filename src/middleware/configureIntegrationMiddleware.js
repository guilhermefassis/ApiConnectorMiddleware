const axios = require('axios');

function callRequest(request){
    return request.get();   

}
class ApiConfigBuilder {
    constructor() {
        this.config = {};
    }

    withApiName(apiName) {
        this.config.apiName = apiName;
        return this;
    }

    withApiUrl(apiUrl) {
        this.config.apiUrl = apiUrl;
        return this;
    }

    withApiRoute(apiRoute) {
        this.config.apiRoute = apiRoute;
        return this;
    }

    withApiVerb(apiVerb) {
        this.config.apiVerb = apiVerb;
        return this;
    }

    withQueryString(queryString) {
        this.config.queryString = queryString;
        return this;
    }

    withHeaders(headers) {
        this.config.headers = headers;
        return this;
    }

    withFields(fields) {
        this.config.fields = fields;
        return this;
    }

    build() {
        return this.config;
    }
}

class RequestFactory {
    constructor(requestStrategy) {
        this.requestStrategy = requestStrategy;
    }

    createRequest(apiCallConfiguration) {
        return this.requestStrategy.createRequest(apiCallConfiguration);
    }
}

class GetRequestStrategy {
    createRequest(apiCallConfiguration) {
        const defaultConfig = {
            baseURL: apiCallConfiguration.apiUrl + apiCallConfiguration.apiRoute + apiCallConfiguration.queryString,
            headers: apiCallConfiguration.headers,
            timeout: 10000
        };
        return axios.create(defaultConfig);
    }
}

async function configureIntegrationMiddleware(req, res, next) {
    try {
        const apiConfig = new ApiConfigBuilder()
            .withApiName(req.body.apiName)
            .withApiUrl(req.body.apiUrl)
            .withApiRoute(req.body.apiRoute)
            .withApiVerb(req.body.apiVerb)
            .withQueryString(req.body.queryString)
            .withHeaders(req.body.headers)
            .withFields(req.body.fields)
            .build();

        if (!apiConfig.apiName ||
            !apiConfig.apiUrl ||
            !apiConfig.apiRoute ||
            !apiConfig.apiVerb ||
            !apiConfig.queryString ||
            !apiConfig.headers ||
            !apiConfig.fields) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

        req.apiConfig = apiConfig;

        if (apiConfig.apiVerb === 'GET') {
            const requestFactory = new RequestFactory(new GetRequestStrategy());
            const request = requestFactory.createRequest(apiConfig);
            try {
                const requestResponse = await callRequest(request);
                console.log(requestResponse.data);
                req.integrationData = requestResponse.data;
                next();
            } catch (error) {
                console.error('Erro na chamada de requisição:', error.message);
                res.status(500).json({ error: 'Erro interno na chamada de requisição' });
            }
        }
    } catch (error) {
        console.error('Erro no middleware:', error.message);
        res.status(500).json({ error: 'Erro interno' });
    }
}

module.exports = {
    configureIntegrationMiddleware
}