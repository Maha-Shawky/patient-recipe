const mongoose = require('mongoose');
const config = require('config');

module.exports = async() => {
    const db = config.get('DB_Connection');
    try {
        await mongoose.connect(db)
        console.log(`Connected to ${db}...`);
    } catch (e) {
        throw `Unable to connect to ${db}`
    };
}