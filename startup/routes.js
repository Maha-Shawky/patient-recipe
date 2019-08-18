const express = require('express');
const users = require('../routes/users')
const ingredients = require('../routes/ingredients')
const diseases = require('../routes/diseases')
const auth = require('../middleware/auth')
const errHandler = require('../middleware/errorhandler')
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger');



module.exports = (app) => {
    app.use(express.json())
    app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    app.use('/api/users', users);
    app.use('/api/ingredients', auth, ingredients);
    app.use('/api/diseases', auth, diseases);
    app.use(errHandler.handle)
    app.use((req, res, next) => { res.status(404).send('Not found, check /swagger route for documentations'); });
}