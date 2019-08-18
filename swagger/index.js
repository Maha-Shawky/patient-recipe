const commonDefinitions = require('./commonDefinitions.json')
const swaggerDefinition = require('./swaggerDefinition.json')
const paths = require('./paths');


const swaggerJson = {
    ...swaggerDefinition,
    paths,
    ...commonDefinitions
};
module.exports = swaggerJson;