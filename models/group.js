module.exports = {
    identity: 'group',
    connection: 'postgresql',
    attributes: {
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
        subject: {
            model: 'subject',
        }
    },
};
