const users = require('../routes/users')

module.exports = (app) => {
    app.use('/api/users', users);
}