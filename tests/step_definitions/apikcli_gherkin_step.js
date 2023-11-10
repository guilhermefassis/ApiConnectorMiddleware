var {Given, When, Then, Before} = require('cucumber')
var apikcli = require('apickli');
var api = undefined;
var config = require('../config.json');

const domain = config.parameters.domain;
const protocol = config.parameters.protocol;

Before(function(scenario, callback) {
    api = new apikcli.Apickli(protocol, domain);
    console.log('apikcli: ' + api)
    callback();
})

Given(/^I set variable (.*) in global scope to (.*)$/, function(variableName, variableValue, callback) {
    api.setGlobalVariable(variableName, variableValue);
    callback();
})

Given(/^I set (.*) header to (.*)$/, function(headerName, headerValue, callback){
  api.addRequestHeader(headerName, headerValue);
  callback();
})

Given(/^I set body to (.*)$/, function(bodyValue, callback){
  api.setRequestBody(bodyValue);
  callback();
})

When(/^I POST to (.*)$/, function (resource, callback) {
  api.post(resource, function (error, response) {
    if (error) {
      callback(new Error(error));
    }
    callback();
  });
});

Then(/^response code should be (.*)$/, function (
  responseCode,
  callback
) {
  var assertion = api.assertResponseCode(responseCode);

  if (assertion.success) {
    callback();
  }
});

Then(/^response code should not be (.*)$/, function (
  responseCode,
  callback
) {
  var assertion = api.assertResponseCode(responseCode);
  assertion.success = !assertion.success;

  if (assertion.success) {
    callback();
  } else {
    callback(prettyPrintJson(assertion));
  }
});

Then(/^response header (.*) should be (.*)$/, function (
  header,
  expression,
  callback
) {
  var assertion = api.assertHeaderValue(header, expression);

  if (assertion.success) {
    callback();
  } else {
    callback(prettyPrintJson(assertion));
  }
});

Then(/^response header (.*) should not be (.*)$/, function (
  header,
  expression,
  callback
) {
  var assertion = api.assertHeaderValue(header, expression);
  assertion.success = !assertion.success;

  if (assertion.success) {
    callback();
  } else {
    callback(prettyPrintJson(assertion));
  }
});

Then(/^response body should contain (.*)$/, function (
  expression,
  callback
) {
  var assertion = api.assertResponseBodyContainsExpression(
    expression
  );

  if (assertion.success) {
    callback();
  } else {
    callback(prettyPrintJson(assertion));
  }
});

Then(/^response body should not contain (.*)$/, function (
  expression,
  callback
) {
  var assertion = api.assertResponseBodyContainsExpression(
    expression
  );
  assertion.success = !assertion.success;

  if (assertion.success) {
    callback();
  } else {
    callback(prettyPrintJson(assertion));
  }
});

Then(/^response body path (.*) should be ((?!of type).+)$/, function (
  path,
  value,
  callback
) {
  var assertion = api.assertPathInResponseBodyMatchesExpression(
    path,
    value
  );

  if (assertion.success) {
    callback();
  } else {
    callback(prettyPrintJson(assertion));
  }
});

Then(
  /^response body path (.*) should not be ((?!of type).+)$/,
  function (path, value, callback) {
    var assertion = api.assertPathInResponseBodyMatchesExpression(
      path,
      value
    );
    assertion.success = !assertion.success;

    if (assertion.success) {
      callback();
    } else {
      callback(prettyPrintJson(assertion));
    }
  }
);

Then(/^response body path (.*) should be of type array$/, function (
  path,
  callback
) {
  var assertion = api.assertPathIsArray(path);
  if (assertion.success) {
    callback();
  } else {
    callback(prettyPrintJson(assertion));
  }
});

Then(
  /^response body path (.*) should be of type array with length (.*)$/,
  function (path, length, callback) {
    var assertion = api.assertPathIsArrayWithLength(path, length);
    if (assertion.success) {
      callback();
    } else {
      callback(prettyPrintJson(assertion));
    }
  }
);

Then(
  /^response body should be valid according to schema file (.*)$/,
  function (schemaFile, callback) {
    api.validateResponseWithSchema(schemaFile, function (assertion) {
      if (assertion.success) {
        callback();
      } else {
        callback(prettyPrintJson(assertion));
      }
    });
  }
);

Then(
  /^response body should be valid according to swagger definition (.*) in file (.*)$/,
  function (definitionName, swaggerSpecFile, callback) {
    api.validateResponseWithSwaggerSpecDefinition(
      definitionName,
      swaggerSpecFile,
      function (assertion) {
        if (assertion.success) {
          callback();
        } else {
          callback(prettyPrintJson(assertion));
        }
      }
    );
  }
);

Then(/^I store the value of body path (.*) as access token$/, function (
  path,
  callback
) {
  api.setAccessTokenFromResponseBodyPath(path);
  callback();
});

When(/^I set bearer token$/, function (callback) {
  
  api.addRequestHeader(
    "X-Client-Auth",
    `Bearer ${api.getGlobalVariable("access_token")}`
  );
  callback();
});

Then(
  /^I store the value of response header (.*) as (.*) in global scope$/,
  function (headerName, variableName, callback) {
    api.storeValueOfHeaderInGlobalScope(headerName, variableName);
    callback();
  }
);

Then(
  /^I store the value of body path (.*) as (.*) in global scope$/,
  function (path, variableName, callback) {
    api.storeValueOfResponseBodyPathInGlobalScope(
      path,
      variableName
    );
    callback();
  }
);

Then(
  /^I store the value of response header (.*) as (.*) in scenario scope$/,
  function (name, variable, callback) {
    api.storeValueOfHeaderInScenarioScope(name, variable);
    callback();
  }
);

Then(
  /^I store the value of body path (.*) as (.*) in scenario scope$/,
  function (path, variable, callback) {
    api.storeValueOfResponseBodyPathInScenarioScope(path, variable);
    callback();
  }
);

Then(/^value of scenario variable (.*) should be (.*)$/, function (
  variableName,
  variableValue,
  callback
) {
  if (api.assertScenarioVariableValue(variableName, variableValue)) {
    callback();
  } else {
    callback(
      new Error(
        "value of variable " +
          variableName +
          " isn't equal to " +
          variableValue
      )
    );
  }
});

Then(/^response body should be valid (xml|json)$/, function (
  contentType,
  callback
) {
  var assertion = api.assertResponseBodyContentType(contentType);

  if (assertion.success) {
    callback();
  }
});

