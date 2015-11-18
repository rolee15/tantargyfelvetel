
var express = require('express');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var session = require('express-session');
var flash = require('connect-flash');
var Waterline = require('waterline');
var memoryAdapter = require('sails-memory');
var diskAdapter = require('sails-disk');
var postgresqlAdapter = require('sails-postgresql');

var app = express();
var orm = new Waterline();

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

//Model layer

// Subject model
var subjectCollection = Waterline.Collection.extend({
    identity: 'subject',
    connection: 'postgresql',
    attributes: {
        date: {
            type: 'datetime',
            defaultsTo: function () { return new Date(); },
            required: true,
        },
        status: {
            type: 'string',
            enum: ['new', 'assigned', 'success', 'rejected', 'pending'],
            required: true,
        },
        location: {
            type: 'string',
            required: true,
        },
        description: {
            type: 'string',
            required: true,
        },
    },
});

orm.loadCollection(subjectCollection);

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
    app.models.subject.find().then(function (subjects) {
        res.render('subjects/list', {
            subjects: decorateErrors(subjects),
            messages: req.flash('info')
        });
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
        // adatok elmentése és a hibalista megjelenítése
        // POST /subjects/new végpont
        app.models.subject.create({
            status: 'new',
            location: req.body.helyszin,
            description: req.body.leiras
        })
        .then(function (subject) {
            req.flash('info', 'Hibajegy sikeresen felvéve!');
            res.redirect('/subjects/list');
        })
        .catch(function (err) {
            //hiba
            console.log(err);
        });
    }
});

// ORM indítása
var config = {
    adapters: {
        memory:     memoryAdapter,
        disk:       diskAdapter,
        postgresql: postgresqlAdapter
    },
    connections: {
        default: {
            adapter: 'disk',
        },
        memory: {
            adapter: 'memory'
        },
        disk: {
            adapter: 'disk'
        },
        postgresql: {
            adapter: 'postgresql',
            database: 'subjects',
            host: 'localhost',
            user: 'ubuntu',
            password: 'ubuntu',
        }
    },
    defaults: {
        migrate: 'alter'
    },
};


orm.initialize(config, function(err, models) {
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


