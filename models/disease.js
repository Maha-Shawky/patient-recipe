const mongoose = require('mongoose');
const Joi = require('Joi');

const ingredientSchema = {
    _id: mongoose.Types.ObjectId,
    name: String,
    category: String
}
const diseaseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        min: 2,
        max: 200
    },
    forbiddenFood: [ingredientSchema],
    recommendedFood: [ingredientSchema],
    creator: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Disease = mongoose.model('Disease', diseaseSchema);
const validateDisease = (disease) => {
    const schema = {
        name: Joi.string().min(2).max(200).required(),
        forbiddenFood: Joi.array().items(Joi.objectId()),
        recommendedFood: Joi.array().items(Joi.objectId())
    }

    return Joi.validate(disease, schema);
}

module.exports = {
    Disease,
    validateDisease
}