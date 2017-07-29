'use strict';

const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({ port: 3500 });

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply('Hello, World!');
    }
});

server.start((err) => {

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});