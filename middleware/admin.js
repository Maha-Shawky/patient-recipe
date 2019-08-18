const { Roles } = require('../models/user')
module.exports = (req, res, next) => {
    if (req.user.roles.indexOf(Roles.Admin) === -1)
        return res.status(403).send('Access denied');
    next();
}