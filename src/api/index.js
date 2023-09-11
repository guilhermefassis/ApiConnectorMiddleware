const express = require('express');
const app = express();
const integrationMiddleware = require('../middleware/configureIntegrationMiddleware');
const mappingMiddleware = require('../middleware/dataMappingMiddleware');
const cors = require('cors');

const configuredIntegrationMiddleware = integrationMiddleware.configureIntegrationMiddleware;
const dataMappingMiddleware = mappingMiddleware.dataMappingMiddleware;

app.use(express.json());
app.use(configuredIntegrationMiddleware);
app.use(dataMappingMiddleware)
app.use(cors())

app.post('/middleware', (req, res) => {
    if (req.integrationData) {
        res.send(req.integrationData);
    } else {
        res.send('No Response' + req.integrationData);
    }
});

app.listen(3001, () => {
    console.log('API rodando na porta 3001');
});