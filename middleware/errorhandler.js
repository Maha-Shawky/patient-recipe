const logger = require('../utils/logger');
module.exports.handle = function(error, req, res, next) {
    logger.logError(error);
    res.status(500).send('Internal server error');
}