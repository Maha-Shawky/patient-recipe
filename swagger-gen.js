/**
 * Convert mongoose models to swagger model and would be saved in "swagger-models.json"
 */
const mongoose = require('mongoose');
const m2s = require('mongoose-to-swagger');

const User = require('./models/user').User;
const Ingredient = require('./models/ingredient').Ingredient;
const Disease = require('./models/disease').Disease;
const db = require('./startup/db')();
const fs = require('fs');

(async() => {
    try {
        await db;

        const fileName = 'swagger-models.json';
        fs.writeFileSync(fileName, '');

        [User, Ingredient, Disease].forEach(model => {
            const swaggerSchema = m2s(model);
            fs.appendFileSync(fileName, `${JSON.stringify(swaggerSchema, null, 2)}\n`);
            console.log(swaggerSchema);
        })
    } catch (e) {
        console.log(e);
    }
    process.exit(0);
})();