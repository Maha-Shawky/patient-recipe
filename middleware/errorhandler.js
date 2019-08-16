module.exports.handle = function(error, req, res, next) {
    res.status(500).send('Internal server error');
}