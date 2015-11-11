
var express = require('express');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var session = require('express-session');
var flash = require('connect-flash');

var app = express();

// View beállítás HBS-hez
app.set('views', './views');
app.set('view engine', 'hbs');

//Middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(flash());

app.use(session({
    cookie: { maxAge: 60000 },
    secret: 'titkos szoveg',
    resave: false,
    saveUninitialized: false,
}));

app.get('/', function (req, res) {
    // Olvasás
    //req.session.parameter
    // Írás
    //req.session.parameter = value;
});

//Model layer
var subjectContainer = [];

//Viewmodel réteg
var statusTexts = {
    'new': 'Új',
    'assigned': 'Hozzárendelve',
    'ready': 'Kész',
    'rejected': 'Elutasítva',
    'pending': 'Felfüggesztve',
};
var statusClasses = {
    'new': 'danger',
    'assigned': 'info',
    'ready': 'success',
    'rejected': 'default',
    'pending': 'warning',
};

function decorateErrors(subjectContainer) {
    return subjectContainer.map(function (e) {
        e.statusText = statusTexts[e.status];
        e.statusClass = statusClasses[e.status];
        return e;
    });
}

// List subjects
app.get('/subjects/list', function (req, res){
  res.render('subjects/list', {
        subjects: decorateErrors(subjectContainer),
        messages: req.flash('info')
    });
})

// New subject
app.get('/subjects/new', function (req, res) {
    var validationErrors = (req.flash('validationErrors') || [{}]).pop();
    var data = (req.flash('data') || [{}]).pop();
    
    res.render('subjects/new', {
        validationErrors: validationErrors,
        data: data,
    });
});


app.post('/subjects/new', function (req, res) {
  
    // adatok ellenőrzése
    req.checkBody('helyszin', 'Hibás helyszín').notEmpty().withMessage('Kötelező megadni!');
    req.sanitizeBody('leiras').escape();
    req.checkBody('leiras', 'Hibás leírás').notEmpty().withMessage('Kötelező megadni!');
    
    var validationErrors = req.validationErrors(true);
    
    if (validationErrors) {
        // űrlap megjelenítése a hibákkal és a felküldött adatokkal
        req.flash('validationErrors', validationErrors);
        req.flash('data', req.body);
        res.redirect('subjects/new');
    }
    else {
        // adatok elmentése (ld. később) és a hibalista megjelenítése
        // POST /errors/new végpont
        subjectContainer.push({
            date: (new Date()).toLocaleString(),
            status: 'new',
            location: req.body.helyszin,
            description: req.body.leiras,
            numberOfMessages: 0
        });
        req.flash('info', 'Hiba sikeresen felvéve!');
        res.redirect('subjects/list');
    }
});


// Listen
var port = process.env.PORT;
var host = process.env.IP;
var server = app.listen(port, host, function(){});




