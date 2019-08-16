const initApp = async() => {
    const Joi = require('Joi');
    Joi.objectId = require('joi-objectid')(Joi);
    require('express-async-errors')


    const express = require('express');
    const app = express();
    app.use(express.json());

    const logger = require('./utils/logger');
    process.on('uncaughtException', (ex) => {
        logger.logError(ex);
        process.exit(1);
    });
    process.on('unhandledRejection', (ex) => {
        logger.logError(ex);
        process.exit(1);
    });

    require('./startup/config')()
    await require('./startup/db')()
    require('./startup/routes')(app)

    const errHandler = require('./middleware/errorhandler')
    app.use(errHandler.handle)

    const port = process.env.PORT || 3000;
    return app.listen(port, () => console.log(`Listening on port ${port}...`));
};

const serverPromise = initApp();
module.exports = serverPromise;