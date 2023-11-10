Feature: Api-ConnectorMiddleware-v1

@set-variables
Scenario: Prepara as variaveis
    Given I set variable header_Accept in global scope to Accept
    Given I set variable header_Content in global scope to Content-Type
    Given I set variable payload_scenario_1_1 in global scope to {"apiName":" openweathermap", "apiUrl": "https://api.openweathermap.org", "apiRoute":"/data/2.5/onecall", "apiVerb": "GET", "queryString": "?lat=33.44&lon=-94.04&exclude=hourly,daily&appid=f04394f2403b2745ef3f5c8d92011d79", "headers": { "Accept": "*/*", "Content-Type": "application/json"}, "params": "", "fields": ["lat", "current.weather[0]", "minutely[1].dt"]}
    Given I set variable payload_scenario_1_2 in global scope to {"apiName":" openweathermap", "apiUrl": "https://api.openweathermap.org", "apiRoute":"/data/2.5/onecall", "apiVerb": "GET", "queryString": "?lat=33.44&lon=-94.04&exclude=hourly,daily&appid=f04394f2403b2745ef3f5c8d92011d79", "headers": { "Accept": "*/*", "Content-Type": "application/json"}, "params": "", "fields": ["lat"]}
    Given I set variable payload_scenario_1_3 in global scope to {"apiName":" openweathermap", "apiUrl": "https://api.openweathermap.org", "apiRoute":"/data/2.5/onecall", "apiVerb": "GET", "queryString": "?lat=33.44&lon=-94.04&exclude=hourly,daily&appid=f04394f2403b2745ef3f5c8d92011d79", "headers": { "Accept": "*/*", "Content-Type": "application/json"}, "params": "", "fields": ["minutely[1]"]}
    Given I set variable payload_scenario_1_4 in global scope to {"apiName":" openweathermap", "apiUrl": "https://api.openweathermap.org", "apiRoute":"/data/2.5/onecall", "apiVerb": "GET", "queryString": "?lat=33.44&lon=-94.04&exclude=hourly,daily&appid=f04394f2403b2745ef3f5c8d92011d79", "headers": { "Accept": "*/*", "Content-Type": "application/json"}, "params": "", "fields": ["minutely[1-10]"]}
    Given I set variable payload_scenario_1_5 in global scope to {"apiName":" openweathermap", "apiUrl": "https://api.openweathermap.org", "apiRoute":"/data/2.5/onecall", "apiVerb": "GET", "queryString": "?lat=33.44&lon=-94.04&exclude=hourly,daily&appid=f04394f2403b2745ef3f5c8d92011d79", "headers": { "Accept": "*/*", "Content-Type": "application/json"}, "params": "", "fields": ["minutely[1-8].precipitation"]}
    # Given I set variable payload_scenario_2_0 in global scope to {"apiName":"REST Countries", "apiUrl": "https://restcountries.com", "apiRoute":"/v3.1/all", "apiVerb": "GET", "headers": { "Accept": "*/*", "Content-Type": "application/json" }, "params": "", "fields": ["[0]"]}
    # Given I set variable payload_scenario_2_1 in global scope to {"apiName":"REST Countries", "apiUrl": "https://restcountries.com", "apiRoute":"/v3.1/all", "apiVerb": "GET", "headers": { "Accept": "*/*", "Content-Type": "application/json" }, "params": "", "fields": ["[0].name.nativeName.ara"]}

@api-connectormiddleware-v1
Scenario: 1.1 Envia uma request com o payload da api openwathermap e acessa objetos, objetos dentro de listas.
    Given I set `header_Accept` header to application/json
    Given I set `header_Content` header to application/json
    Given I set body to `payload_scenario_1_1`
    When I POST to /middleware 
    Then response code should be 200 
    Then response body should be valid json
    Then response header content-type should be application/json
    Then response body should contain lat
	Then response body should contain weather
	Then response body should contain dt

@api-connectormiddleware-v1
Scenario: 1.2 Envia uma request com o payload da api openwathermap e acessa apenas um parametro.
    Given I set `header_Accept` header to application/json
    Given I set `header_Content` header to application/json
    Given I set body to `payload_scenario_1_2`
    When I POST to /middleware 
    Then response code should be 200 
    Then response body should be valid json
    Then response header content-type should be application/json
    Then response body should contain lat

@api-connectormiddleware-v1
Scenario: 1.3 Envia uma request com o payload da api openwathermap e acessa uma lista.
    Given I set `header_Accept` header to application/json
    Given I set `header_Content` header to application/json
    Given I set body to `payload_scenario_1_3`
    When I POST to /middleware 
    Then response code should be 200 
    Then response body should be valid json
    Then response header content-type should be application/json
    Then response body should contain minutely

@api-connectormiddleware-v1
Scenario: 1.4 Envia uma request com o payload da api openwathermap e acessa uma sequencia de itens em uma lista.
    Given I set `header_Accept` header to application/json
    Given I set `header_Content` header to application/json
    Given I set body to `payload_scenario_1_4`
    When I POST to /middleware 
    Then response code should be 200 
    Then response body should be valid json
    Then response header content-type should be application/json
    Then response body should contain minutely

@api-connectormiddleware-v1
Scenario: 1.5 Envia uma request com o payload da api openwathermap e acessa uma propiedade dentro de uma sequencia de itens em uma lista.
    Given I set `header_Accept` header to application/json
    Given I set `header_Content` header to application/json
    Given I set body to `payload_scenario_1_5`
    When I POST to /middleware 
    Then response code should be 200 
    Then response body should be valid json
    Then response header content-type should be application/json
    Then response body should contain precipitation

# @api-connectormiddleware-v1
# Scenario: 2.0 Envia uma request com o payload da api REST Countries e acessa uma lista passando apenas o index.
#     Given I set `header_Accept` header to application/json
#     Given I set `header_Content` header to application/json
#     Given I set body to `payload_scenario_2_0`
#     When I POST to /middleware 
#     Then response code should be 200 
#     Then response body should be valid json
#     Then response header content-type should be application/json

# @api-connectormiddleware-v1
# Scenario: 2.1 Envia uma request com o payload da api REST Countries e acessa uma lista passando apenas o index.
#     Given I set `header_Accept` header to application/json
#     Given I set `header_Content` header to application/json
#     Given I set body to `payload_scenario_2_0`
#     When I POST to /middleware 
#     Then response code should be 200 
#     Then response body should be valid json
#     Then response header content-type should be application/json
#     Then response body should contain ara