const integrationMiddleware = require('./src/middleware/configureIntegrationMiddleware');
const dataMappingMiddleware = require('./src/middleware/dataMappingMiddleware');

module.exports = {
    integrationMiddleware,
    dataMappingMiddleware
}