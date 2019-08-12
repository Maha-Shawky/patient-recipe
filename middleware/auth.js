const jwt = require('jsonwebtoken');
const config = require('config');
const { authHeader, jwtSecretKey } = require('../utils/constants')

module.exports = (req, res, next) => {
    try {
        const token = req.header(authHeader);
        if (!token)
            return res.status(401).send('Access denied. No token provided');

        const decodedToken = jwt.verify(token, config.get(jwtSecretKey));
        req.user = decodedToken;
        next();

    } catch (e) {
        console.log(e);
        res.status(400).send('Invalid token');
    }
}