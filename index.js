const initApp = async() => {
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