require('express-async-errors')
const logger = require('../utils/logger');

process.on('uncaughtException', (ex) => {
    logger.logError(ex);
    process.exit(1);
});
process.on('unhandledRejection', (ex) => {
    logger.logError(ex);
    process.exit(1);
});