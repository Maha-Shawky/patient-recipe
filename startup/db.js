const mongoose = require('mongoose');
const config = require('config');

module.exports = async() => {
    const db = config.get('DB_Connection');
    try {
        mongoose.set('useCreateIndex', true);
        await mongoose.connect(db, { useNewUrlParser: true })
        console.log(`Connected to ${db}...`);
    } catch (e) {
        throw new Error(`Unable to connect to ${db}`)
    };
}