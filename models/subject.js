module.exports = {
    identity: 'subject',
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
        groups: {
            collection: 'group',
            via: 'subject'
        },
    },
};
