const users = require('../routes/users')
const ingredients = require('../routes/ingredients')
const auth = require('../middleware/auth')

module.exports = (app) => {
    app.use('/api/users', users);
    app.use('/api/ingredients', auth, ingredients);
}