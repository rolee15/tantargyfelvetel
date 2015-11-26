module.exports = {
    // Middleware segédfüggvény
    setLocalsForLayout: function() {
        return function (req, res, next) {
            res.locals.loggedIn = req.isAuthenticated();
            res.locals.user = req.user;
            next();
        };
    },
    ensureAuthenticated: function(req, res, next) {
        if (req.isAuthenticated()) { return next(); }
        res.redirect('/login');
    },
    andRestrictTo: function(role) {
        return function(req, res, next) {
            if (req.user.role == role) {
                next();
            } else {
                next(new Error('Unauthorized'));
            }
        };
    }

};