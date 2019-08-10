const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User, validate } = require('../models/user');


router.post('/register', async(req, res) => {
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    const user = new User(_.pick(req.body, ['name', 'email', 'password', 'roles']));

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    try {

        const result = await new User(user).save()
        return res.send(_.pick(result, ['_id', 'name', 'email', 'roles']));
    } catch (err) {
        if (err && err.code === 11000) {
            return res.status(400).send('User alreay exist');
        }
        throw (err);
    }
})

router.post('/login', async(req, res) => {
    const { email, password } = _.pick(req.body, ['email', 'password']);
    if (!email)
        return res.status(400).send('email is missing');

    if (!password)
        return res.status(400).send('password is missing');

    const user = await User.findOne({ email });
    if (!user)
        return res.status(404).send('user not found');

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
        return res.status(404).send('user not found');

    const token = user.generateAuthToken();
    res.send({ token });
})

module.exports = router;