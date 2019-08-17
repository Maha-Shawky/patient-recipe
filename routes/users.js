const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const _ = require('lodash');
const userModel = require('../models/user');
const { authHeaderKey } = require('../utils/constants')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')


const sendAuthResponse = (user, res) => {
    const token = user.generateAuthToken();
    res.header(authHeaderKey, token).send(_.pick(user, ['_id', 'name', 'email', 'roles']));
}
router.post('/', auth, admin, async(req, res) => {
    const { error } = userModel.validateUser(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    const user = new userModel.User(_.pick(req.body, ['name', 'email', 'password', 'roles']));

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    try {
        const result = await user.save()
        return sendAuthResponse(result, res);

    } catch (err) {
        if (err && err.code === 11000)
            return res.status(400).send('User already exist');

        throw (err);
    }
})

router.post('/login', async(req, res) => {
    const { email, password } = _.pick(req.body, ['email', 'password']);
    if (!email)
        return res.status(400).send('email is missing');

    if (!password)
        return res.status(400).send('password is missing');

    const user = await userModel.User.findOne({ email });
    if (!user)
        return res.status(404).send('user not found');

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
        return res.status(404).send('user not found');

    sendAuthResponse(user, res);
})

module.exports = router;