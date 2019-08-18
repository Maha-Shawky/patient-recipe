const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const mongoose = require('mongoose');
const config = require('config');

module.exports = async() => {
    const db = `${config.get('DbServer')}/${config.get('DbName')}`;
    try {
        mongoose.set('useCreateIndex', true);
        await mongoose.connect(db, { useNewUrlParser: true })
        console.log(`Connected to ${db}...`);
    } catch (e) {
        throw new Error(`Unable to connect to ${db}`)
    };
}