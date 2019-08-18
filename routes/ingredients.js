const express = require('express');
const router = express.Router();
const _ = require('lodash');
const admin = require('../middleware/admin')
const { Ingredient, validateIngredient } = require('../models/ingredient');


router.post('/', admin, async(req, res) => {
    const { error } = validateIngredient(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    try {
        const ingredient = _.pick(req.body, ['name', 'category']);
        const result = await new Ingredient(ingredient).save();
        res.send(_.pick(result, ['_id', 'name', 'category']));
    } catch (err) {
        if (err && err.code === 11000)
            return res.status(400).send('Ingredient already exist');

        throw (err);
    }
})

module.exports = router;