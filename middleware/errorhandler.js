module.exports.handle = function(error, req, res, next) {
    console.error(error);
    next()
}