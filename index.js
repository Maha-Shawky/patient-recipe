const initApp = async() => {
    const Joi = require('Joi');
    Joi.objectId = require('joi-objectid')(Joi);

    const express = require('express');
    const app = express();

    require('./startup/logging')
    require('./startup/config')()
    await require('./startup/db')()
    require('./startup/routes')(app)
    require('./startup/deployment')(app)

    const port = process.env.PORT || 3000;
    return app.listen(port, () => console.log(`Listening on port ${port}...`));
};

const serverPromise = initApp();
module.exports = serverPromise;