const initApp = async() => {
    try {
        require('dotenv').config();

        const express = require('express');
        const app = express();
        app.use(express.json());

        require('./startup/config')()
        await require('./startup/db')()
        require('./startup/routes')(app)

        app.use((err, req, res, next) => {
            console.log(err)
        })

        const port = process.env.PORT || 3000;
        return app.listen(port, () => console.log(`Listening on port ${port}...`));
    } catch (e) {
        console.log(`Unable to initialize server, Error: ${e}`);
        process.exit(1);
    }
};

const serverPromise = initApp();
module.exports = serverPromise;