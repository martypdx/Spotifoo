module.exports = function() {
    return (req, res, next) => {
        if(req.user.role !== 'admin') {
            next({
                status: 403,
                error: 'Requires Admin'
            });
        }
        else next();
    };
};