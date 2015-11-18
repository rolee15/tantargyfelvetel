var express = require('express');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var session = require('express-session');
var flash = require('connect-flash');

var Waterline = require('waterline');
var waterlineConfig = require('./config/waterline');
var subjectCollection = require('./models/subject');

//var indexRouter = require('./controllers/index');
var subjectRouter = require('./controllers/subject');
//var loginRouter = require('./controllers/login');

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
    cookie: { maxAge: 60000 },
    secret: 'titkos szoveg',
    resave: false,
    saveUninitialized: false,
}));
app.use(flash());

//endpoint
app.use('/subjects', subjectRouter);

// ORM példány
var orm = new Waterline();
orm.loadCollection(Waterline.Collection.extend(subjectCollection));

// ORM indítása
orm.initialize(waterlineConfig, function(err, models) {
    if(err) throw err;
    
    app.models = models.collections;
    app.connections = models.connections;
    
    // Start Server
    var port = process.env.PORT || 3000;
    app.listen(port, function () {
        console.log('Server is started.');
    });
    
    console.log("ORM is started.");
});


