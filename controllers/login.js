var passport = require('passport');

var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var GOOGLE_CLIENT_ID = "916531238690-hfst0olp1qni07io6u2go4vrdl7p2vvm.apps.googleusercontent.com";
var GOOGLE_CLIENT_SECRET = "-Gi-RsUXHQVhRhhJ8E8P3Fc_";

passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

// Local Strategy for sign-up
passport.use('local-signup', new LocalStrategy({
        usernameField: 'neptun',
        passwordField: 'password',
        passReqToCallback: true,
    },   
    function(req, neptun, password, done) {
        req.app.models.user.findOne({ neptun: neptun }, function(err, user) {
            if (err) { return done(err); }
            if (user) {
                return done(null, false, { message: 'Létező neptun.' });
            }
            req.app.models.user.create(req.body)
            .then(function (user) {
                return done(null, user);
            })
            .catch(function (err) {
                return done(null, false, { message: err.details });
            });
        });
    }
));

// Stratégia
passport.use('local', new LocalStrategy({
        usernameField: 'neptun',
        passwordField: 'password',
        passReqToCallback: true,
    },
    function(req, neptun, password, done) {
        req.app.models.user.findOne({ neptun: neptun }, function(err, user) {
            if (err) { return done(err); }
            if (!user || !user.validPassword(password)) {
                return done(null, false, { message: 'Helytelen adatok.' });
            }
            return done(null, user);
        });
    }
));
passport.use('google', new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "https://tantargyfelvetel-rolee15.c9users.io/login/return"
    },
    function(accessToken, refreshToken, profile, done) {
        console.log(profile)
        return done(null, profile);
    }
));

module.exports = passport;