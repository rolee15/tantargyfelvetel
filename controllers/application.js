var express = require('express');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var session = require('express-session');
var flash = require('connect-flash');

var indexRouter = require('../routers/index');
var loginRouter = require('../routers/login');
var subjectRouter = require('../routers/subject');
var teacherRouter = require('../routers/teacher');
var logoutRouter = require('../routers/logout');

var pass = require('./login');
var mid = require('./middleware');

// express app
var app = express();

//config
app.set('views', './views');
app.set('view engine', 'hbs');

//Middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(session({
    cookie: { maxAge: 1200000 },
    secret: 'titkos szoveg',
    resave: false,
    saveUninitialized: false,
}));
app.use(flash());
app.use(pass.initialize());
app.use(pass.session());
app.use(mid.setLocalsForLayout());

//endpoint
app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/subjects', mid.ensureAuthenticated, subjectRouter);
app.use('/teacher', mid.ensureAuthenticated, mid.andRestrictTo('teacher'), teacherRouter);
app.use('/logout', logoutRouter);

app.get('/awesome', function(req, res) {
  res.send('You\'re Awesome.');
});

module.exports = app;
