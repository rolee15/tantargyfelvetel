var express = require('express');

var router = express.Router();

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

router.get('/list', function (req, res) {
    req.app.models.registeredsubject.find().then(function (subjects) {
        res.render('subjects/list', {
            subjects: subjects,
            messages: req.flash('info')
        });
    });
});

router.get('/list/:id', function (req, res) {
    req.app.models.registeredsubject.findOne({id: req.params.id}).then(function (subject) {
        res.render('subjects/subject', {
            subject: subject,
            messages: req.flash('info')
        });
    });
});

router.get('/register', function (req, res) {
    req.app.models.subject.find().then(function (subjects) {
        res.render('subjects/register', {
            subjects: subjects,
            messages: req.flash('info')
        });
    });
});

router.get('/new',  function (req, res) {
    var validationErrors = (req.flash('validationErrors') || [{}]).pop();
    var data = (req.flash('data') || [{}]).pop();
    
    res.render('subjects/new', {
        validationErrors: validationErrors,
        data: data,
    });
});

router.post('/new', function (req, res) {
    // adatok ellenőrzése
    req.checkBody('code', 'Hibás kurzuskód').notEmpty().withMessage('Kötelező megadni!');
    req.checkBody('name', 'Hibás név').notEmpty().withMessage('Kötelező megadni!');
    req.checkBody('type', 'Hibás típus').notEmpty().withMessage('Kötelező megadni!');
    req.checkBody('date', 'Hibás időpont').notEmpty().withMessage('Kötelező megadni!');
    req.checkBody('location', 'Hibás helyszín').notEmpty().withMessage('Kötelező megadni!');
    req.checkBody('teacher', 'Hibás tanár').notEmpty().withMessage('Kötelező megadni!');
    
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
        req.app.models.subject.create({
            code: req.body.code,
            name: req.body.name,
            type: req.body.type,
            date: req.body.date,
            location: req.body.location,
            teacher: req.body.teacher
        })
        .then(function (subject) {
            req.flash('info', 'Tantárgy sikeresen felvéve!');
            res.redirect('/subjects/register');
        })
        .catch(function (err) {
            //hiba
            console.log(err);
        });
    }
});

module.exports = router;