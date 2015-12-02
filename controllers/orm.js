var Waterline = require('waterline');

var subjectCollection = require('../models/subject');
var registeredsubjectCollection = require('../models/register/subject');
var userCollection = require('../models/register/user');

// ORM példány
var orm = new Waterline();
orm.loadCollection(Waterline.Collection.extend(subjectCollection));
orm.loadCollection(Waterline.Collection.extend(registeredsubjectCollection));
orm.loadCollection(Waterline.Collection.extend(userCollection));

module.exports = orm;
