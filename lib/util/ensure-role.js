module.exports = function(requiredRole) {
    return (req, res, next) => {
        if(req.user.role !== 'admin') {
            next({
                status: 403,
                error: `Requires ${requiredRole} Role`
            });
        }
        else next();
    };
};