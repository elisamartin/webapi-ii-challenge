const express = require('express');
const postsRoutes = require('./routes');

const server = express();

server.use(postsRoutes);

module.exports = server;
