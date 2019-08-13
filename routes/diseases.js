const express = require('express');
const router = express.Router();
const _ = require('lodash');
const admin = require('../middleware/admin')
const { Disease, validateDisease } = require('../models/disease');
const { Ingredient } = require('../models/ingredient')
const { isValidId, isValidArray } = require('../utils/validation')

router.post('/', admin, async(req, res) => {
    const { error } = validateDisease(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);


    let forbiddenFood = await Ingredient.find({ _id: { "$in": req.body.forbiddenFood } })
    forbiddenFood = forbiddenFood.map(f => ({ _id: f._id, name: f.name, category: f.category }));

    let recommendedFood = await Ingredient.find({ _id: { "$in": req.body.recommendedFood } });
    recommendedFood = recommendedFood.map(f => ({ _id: f._id, name: f.name, category: f.category }));

    const disease = await new Disease({
        name: req.body.name,
        forbiddenFood,
        recommendedFood,
        creator: req.user._id
    }).save();

    res.send(_.pick(disease, ['_id', 'name', 'forbiddenFood', 'recommendedFood']));
})


router.get('/ingredients/:ingredientId/forbidden', async(req, res) => {
    const ingredientId = req.params['ingredientId'];
    if (!isValidId(ingredientId))
        return res.status(400).send('Invalid ingredient id');

    const diseasesList = req.query.diseases;
    if (!isValidArray(diseasesList, true))
        return res.status(400).send('Invalid diseases');

    for (let d of diseasesList) {
        if (!isValidId(d))
            return res.status(400).send(`Invalid disease id ${d}`);
    }

    const result = await Disease.find({ _id: { $in: diseasesList }, 'forbiddenFood._id': ingredientId });
    const diseases = result.map(d => d._id.toString());
    res.status(200).send({ diseases });
})


module.exports = router;