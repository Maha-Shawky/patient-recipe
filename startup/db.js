const mongoose = require('mongoose');
const config = require('config');

module.exports = () => {
    const db = config.get('DB_Connection');
    mongoose.connect(db)
        .then(() => console.log(`Connected to ${db}...`))
        .catch(e => {
            console.log(`Unable to connect to ${db}`)
        });
}