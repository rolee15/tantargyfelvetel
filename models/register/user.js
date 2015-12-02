var bcrypt = require('bcryptjs');

module.exports = {
    identity: 'user',
    connection: 'memory',
    attributes: {
        neptun: {
            type: 'string',
            required: true,
            unique: true,
        },
        password: {
            type: 'string',
            required: true,
        },
        surname: {
            type: 'string',
            required: true,
        },
        forename: {
            type: 'string',
            required: true,
        },
        role: {
            type: 'string',
            enum: ['student', 'teacher'],
            required: true,
            defaultsTo: 'student'
        },
        
        registeredsubjects: {
            collection: 'registeredsubject',
            via: 'user'
        },
        
        validPassword: function (password) {
            return bcrypt.compareSync(password, this.password);
        },
    },
    beforeCreate: function(values, next) {
        bcrypt.hash(values.password, 10, function(err, hash) {
            if (err) {
                return next(err);
            }
            values.password = hash;
            next();
        });
    }
};