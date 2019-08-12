const Joi = require('joi');
const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minlength: 2,
        maxlength: 200
    },
    category: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 200
    },
})
const Ingredient = mongoose.model('Ingredient', ingredientSchema);

const validateIngredient = (ingredient) => {
    const schema = {
        name: Joi.string().min(2).max(200).required(),
        category: Joi.string().min(2).max(200).required(),
    }
    return Joi.validate(ingredient, schema);
}

module.exports = {
    Ingredient,
    validateIngredient
}