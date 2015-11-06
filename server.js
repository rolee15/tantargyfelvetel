
var express = require('express');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');

var app = express();

// View beállítás HBS-hez
app.set('views', './views');
app.set('view engine', 'hbs');

//Middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());

// List subjects
app.get('/subjects/list', function (req, res){
  res.render('subjects/list',
  {
        subjects: [
            {
                date: '2015.09.16.',
                statusClass: 'danger',
                statusText: 'Új',
                location: 'PC6-15',
                description: 'Rossz billentyűzet',
                numberOfMessages: 5
            },
            {
                date: '2015.09.16.',
                statusClass: 'danger',
                statusText: 'Új',
                location: 'PC6-16',
                description: 'Rossz monitor',
                numberOfMessages: 5
            },
        ]
    }
  
  );
})

// New subject
app.get('/subjects/new', function (req, res) {
    res.render('subjects/new');
});


app.post('/subjects/new', function (req, res) {
  
   console.log(req.body);
   
    // adatok ellenőrzése
    req.checkBody('helyszin', 'Hibás helyszín').notEmpty().withMessage('Kötelező megadni!');
    req.sanitizeBody('leiras').escape();
    req.checkBody('leiras', 'Hibás leírás').notEmpty().withMessage('Kötelező megadni!');
    
    var validationErrors = req.validationErrors(true);
    console.log(validationErrors);
    
    if (validationErrors) {
        // űrlap megjelenítése a hibákkal és a felküldött adatokkal
        console.log(validationErrors);
        res.redirect('subjects/new');
    }
    else {
        // adatok elmentése (ld. később) és a hibalista megjelenítése
        console.log("mentes");
        res.redirect('subjects/list');
    }
});


// Listen
var port = process.env.PORT;
var host = process.env.IP;
var server = app.listen(port, host, function(){});




