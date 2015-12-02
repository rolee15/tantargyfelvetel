module.exports = {
    identity: 'registeredsubject',
    connection: 'memory',
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
        date: {
            type: 'string',
            required: true,
        },
        location: {
            type: 'string',
            required: true,
        },
        user: {
            model: 'user',
        },
    },
};
