require('dotenv').config();
const config = require('config');
const { jwtSecretKey } = require('../utils/constants')

module.exports = function() {
    if (!config.get(jwtSecretKey)) {
        throw new Error('FATAL ERROR: jwtSecret is not defined.');
    }
}