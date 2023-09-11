class MappingConfigBuilder {
    constructor() {
        this.config = {};
    }

    withApiName(apiName) {
        this.config.apiName = apiName;
        return this;
    }

    withFields(fields) {
        this.config.fields = fields;
        return this;
    }

    withResponse(response) {
        this.config.response = response;
        return this;
    }

    build() {
        return this.config;
    }
}

function dataMappingMiddleware(req, res, next) {
    try {
        const apiConfig = new MappingConfigBuilder()
            .withApiName(req.apiConfig.apiName)
            .withFields(req.apiConfig.fields)
            .withResponse(req.integrationData)
            .build();
        
        const responseBody = buildMappedResponse(apiConfig);
        req.integrationData = responseBody;
        next(); 
    } catch(err) {
        console.error("Error in dataMappingMiddleware: ", err.message);
        next(err);
    }
}

function buildMappedResponse(apiConfig) {
    const allBody = '*';
    let responseBody = {};
    responseBody[apiConfig.apiName] = {}

    if (apiConfig.fields.length === 0 || apiConfig.fields[0] === allBody) {
        responseBody[apiConfig.apiName] = apiConfig.response;
    } else {
        for (const field of apiConfig.fields) {
            responseBody = addFieldToResponse(field, apiConfig, responseBody);
        }
    }

    return responseBody;
}

function addFieldToResponse(field, apiConfig, responseBody) {
    const fieldName = extractParamName(field.split('.').pop()) || field.split('.').pop();
    responseBody[apiConfig.apiName][fieldName] = getNestedValue(apiConfig.response, field);
    
    return responseBody;
}

function getNestedValue(json, field) {
    const nestedFields = field.split('.');
    let currentValue  = json;

    for (const nestedField of nestedFields) {
        if(isArrayIndexedField(nestedField) && currentValue.hasOwnProperty(extractParamName(nestedField))) {
            currentValue  = currentValue[extractParamName(nestedField)][extractIndexFromField(nestedField)];
        } else if (currentValue.hasOwnProperty(nestedField)) {
            currentValue = currentValue[nestedField];
        } else {   
            throw new Error(`Field "${nestedField}" not found in the JSON`);
        }
    }
    return currentValue;
}

function extractIndexFromField(field) {
    return field.split('[')[1].split(']')[0];
}

function extractParamName(field) {
    return field.split('[')[0];
}

function isArrayIndexedField(field) {
    return field.includes("[");
}

module.exports = {
    dataMappingMiddleware
}