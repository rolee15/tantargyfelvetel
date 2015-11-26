var Waterline = require('waterline');

var subjectCollection = require('../models/subject');
var userCollection = require('../models/user');

// ORM példány
var orm = new Waterline();
orm.loadCollection(Waterline.Collection.extend(subjectCollection));
orm.loadCollection(Waterline.Collection.extend(userCollection));

module.exports = orm;
