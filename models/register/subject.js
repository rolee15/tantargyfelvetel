module.exports = {
    identity: 'registeredsubject',
    connection: 'postgresql',
    attributes: {
        code: {
            type: 'string',
            required: true,
        },
        name: {
            type: 'string',
            required: true,
        },
        type: {
            type: 'string',
            enum: ['Gyakorlat', 'Előadás'],
            required: true,
        },
        credit: {
            type: 'integer',
            required: true,
        },
        date: {
            type: 'string',
            required: true,
        },
        location: {
            type: 'string',
            required: true,
        },
        teacher: {
            type: 'string',
            required: true,
        },
        user: {
            model: 'user',
        },
    },
};
