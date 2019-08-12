const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const Roles = Object.freeze({
    Admin: 'admin',
    User: 'user',
});

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        maxlength: 64,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    roles: {
        type: [{ type: String, enum: Object.values(Roles) }],
        required: true
    }
});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id, name: this.name, roles: this.roles, email: this.email }, config.get('jwtSecret'));
    return token;
}

const User = mongoose.model('User', userSchema);

function validate(user) {
    const schema = {
        name: Joi.string().min(2).max(50).required(),
        email: Joi.string().max(64).required().email(),
        password: Joi.string().min(5).max(255).required(),
        roles: Joi.array().items(Joi.string())
    };

    return Joi.validate(user, schema);
}
module.exports = {
    Roles,
    User,
    validate
}