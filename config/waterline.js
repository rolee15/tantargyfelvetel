var memoryAdapter = require('sails-memory');
var diskAdapter = require('sails-disk');
var postgresqlAdapter = require('sails-postgresql');

// konfiguráció
module.exports = {
    adapters: {
        memory:     memoryAdapter,
        disk:       diskAdapter,
        postgresql: postgresqlAdapter
    },
    connections: {
        default: {
            adapter: 'disk',
        },
        memory: {
            adapter: 'memory'
        },
        disk: {
            adapter: 'disk'
        },
        postgresql: {
            adapter: 'postgresql',
            database: 'subjects',
            host: 'localhost',
            user: 'ubuntu',
            password: 'ubuntu',
        }
    },
    defaults: {
        migrate: 'alter'
    },
};
