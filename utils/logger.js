const winston = require('winston');
winston.add(new winston.transports.Console())
winston.add(new winston.transports.File({ filename: 'errors.log' }))

module.exports.logError = (ex) => {
    const message = ex.message || ex;
    console.log(message);
    winston.error(message, ex);
}