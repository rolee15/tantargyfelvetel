var express = require('express');

var router = express.Router();

router.get('/', function(req, res){
    res.send('You\'re a teacher Harry.');
});

module.exports = router;