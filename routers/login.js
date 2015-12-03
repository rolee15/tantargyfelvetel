var express = require('express');
var passport = require('passport');

var router = express.Router();

router.get('/', function (req, res) {
    res.render('login/index', {
        errorMessages: req.flash('error')
    });
});
router.post('/', passport.authenticate('local', {
    successRedirect: '/subjects/register',
    failureRedirect: '/login',
    failureFlash: true,
    badRequestMessage: 'Hiányzó adatok'
}));
router.get('/signup', function (req, res) {
    res.render('login/signup', {
        errorMessages: req.flash('error')
    });
});
router.post('/signup', passport.authenticate('local-signup', {
    successRedirect:    '/subjects/register',
    failureRedirect:    '/login/signup',
    failureFlash:       true,
    badRequestMessage:  'Hiányzó adatok'
}));
router.get('/google', passport.authenticate('google', {
    scope: 'https://www.googleapis.com/auth/plus.login'
}));

router.get('/return', passport.authenticate('google', { 
    successRedirect: '/subjects/register',
    failureRedirect: '/' 
}));

module.exports = router;
