
function dataMappingMiddleware(req, res, next) {
    const fields = req.apiConfig.fields;
    const apiName = req.apiConfig.apiName;
    let response = req.integrationData;

    let responseBody = {}
    responseBody[apiName] = {}
    if(fields.length >= 1 && fields[0] !== '*') {
        for (let i = 0; i < fields.length; i++) {
            let haveMoreOneParam = checkIfHaveASingleParam(fields[i])
            if(haveMoreOneParam) {
                responseBody[apiName][fieldName = fields[i].split('.').pop()] = searchFieldInObject(response, fields[i]);
            } else {
                responseBody[apiName][fields[i]] = response[fields[i]];  
            }
        }
    } else if (fields.length === 0 || fields[0] === '*') {
        responseBody[apiName] = response;
    } 
    req.integrationData = responseBody;
    next();
}

module.exports = {
    dataMappingMiddleware
}


function checkIfHaveASingleParam(param) {
    try {
        let params = param.split('.');
        if (params.length > 1) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.log(err);
    }
}

function searchFieldInObject(json, field) {
    const nestedFields = field.split('.');
    let actualJson = json;

    for (const nestedField of nestedFields) {
        if (actualJson.hasOwnProperty(nestedField)) {
            actualJson = actualJson[nestedField];
        } else {   
            console.error("ERRO");;
        }
    }
    return actualJson;
}
