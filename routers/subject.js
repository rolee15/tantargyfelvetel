var express = require('express');

var router = express.Router();

//Felvett tárgyak
router.get('/register', function (req, res) {
    req.app.models.registeredsubject.find().then(function (subjects) {
        res.render('subjects/register/list', {
            subjects: subjects,
            messages: req.flash('info')
        });
    });
});
router.get('/register/:id', function (req, res) {
    req.app.models.registeredsubject.findOne({id: req.params.id}).then(function (subject) {
        res.render('subjects/register/subject', {
            subject: subject,
            messages: req.flash('info')
        });
    });
});

//Meghirdetett tárgyak
router.get('/list', function (req, res) {
    req.app.models.subject.find().then(function (subjects) {
        res.render('subjects/list', {
            subjects: subjects,
            messages: req.flash('info')
        });
    });
});
router.get('/list/:id', function (req, res) {
    req.app.models.subject.findOne({id: req.params.id}).then(function (subject) {
        req.app.models.group.find({subject: subject.id}).then(function (groups) {
            res.render('subjects/subject', {
                subject: subject,
                groups: groups,
                messages: req.flash('info')
            });
        });
    });
});

//Tárgy felvétele
router.get('/take/:id', function (req, res) {
    req.app.models.group.findOne({id: req.params.id}).then(function (group) {
        req.app.models.subject.findOne({id: group.subject}).then(function (subject) {
            req.app.models.registeredsubject.findOrCreate({code: subject.code}, {
                code: subject.code,
                name: subject.name,
                type: subject.type,
                credit: subject.credit,
                date: group.date,
                location: group.location,
                teacher: group.teacher,
            })
            .then(function (subject) {
                res.redirect('/subjects/register');
            })
            .catch(function (err) {
                //hiba
                console.log(err);
            });
        });
    });
});

//Tárgy leadása
router.get('/delete/:id', function (req, res) {
    req.app.models.registeredsubject.destroy({id: req.params.id}).then(function (subject) {
        res.redirect('/subjects/register');
    });
});

//Új tárgy
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
    req.checkBody('credit', 'Hibás kredit').notEmpty().withMessage('Kötelező megadni!');
    req.checkBody('date', 'Hibás időpont').notEmpty().withMessage('Kötelező megadni!');
    req.checkBody('location', 'Hibás helyszín').notEmpty().withMessage('Kötelező megadni!');
    req.checkBody('teacher', 'Hibás tanár').notEmpty().withMessage('Kötelező megadni!');
    
    var validationErrors = req.validationErrors(true);
    
    if (validationErrors) {
        // űrlap megjelenítése a hibákkal és a felküldött adatokkal
        req.flash('validationErrors', validationErrors);
        req.flash('data', req.body);
        res.redirect('new');
    }
    else {
        // adatok elmentése és a hibalista megjelenítése
        // POST /subjects/new végpont
        req.app.models.subject.findOrCreate({code: req.body.code}, {
            code: req.body.code,
            name: req.body.name,
            type: req.body.type,
            credit: req.body.credit
        })
        .then(function (subject) {
            req.app.models.group.create({
                date: req.body.date,
                location: req.body.location,
                teacher: req.body.teacher,
                subject: subject.id
            })
            .then(function () {
                req.flash('info', 'Tantárgy sikeresen hozzáadva!');
                res.redirect('list');
            })
            .catch(function (err) {
                //hiba
                console.log(err);
            });
        })
        .catch(function (err) {
            //hiba
            console.log(err);
        });
    }
});

module.exports = router;