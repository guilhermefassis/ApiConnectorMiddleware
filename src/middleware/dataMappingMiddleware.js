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
    if (isArrayIndexedField(fieldName)) {
        responseBody[apiConfig.apiName] = getNestedValue(apiConfig.response, field);
    } else {
        responseBody[apiConfig.apiName][fieldName] = getNestedValue(apiConfig.response, field);
    }
    
    return responseBody;
}

function getNestedValue(json, field) {
    const nestedFields = field.split('.');
    let currentValue  = json;

    for (const nestedField of nestedFields) {
        if(isArrayIndexedField(nestedField) && currentValue.hasOwnProperty(extractParamName(nestedField))) {
            const extractedIndex = extractIndexFromField(nestedField)
            currentValue  = currentValue[extractParamName(nestedField)].slice(extractedIndex.split('-')[0], extractedIndex.split('-')[1] || parseInt(extractedIndex.split('-')[0]) + 1);
        } else if (currentValue.hasOwnProperty(nestedField) || checkIfArrayContainsProperty(currentValue, nestedField)) {
            currentValue = addPropertyInJSON(nestedField, currentValue);
        } else if(isArrayIndexedField(nestedField)) {
            currentValue = currentValue[extractIndexFromField(nestedField)];
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

function addPropertyInJSON(field, json) {
    var newArrray = []
    if(Array.isArray(json)) {
        json.forEach(object => {
            if (object.hasOwnProperty(field)) {
                newArrray.push(object[field]);
            }
        });
        return newArrray;
    } else {
        return json[field];
    }
}

function checkIfArrayContainsProperty(array, field) {
    for (const object of array) {
        if (object.hasOwnProperty(field)) {
          return true;
        }
      }
      return false;
}

module.exports = {
    dataMappingMiddleware
}