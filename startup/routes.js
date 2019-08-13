const users = require('../routes/users')
const ingredients = require('../routes/ingredients')
const diseases = require('../routes/diseases')
const auth = require('../middleware/auth')

module.exports = (app) => {
    app.use('/api/users', users);
    app.use('/api/ingredients', auth, ingredients);
    app.use('/api/diseases', auth, diseases);
}