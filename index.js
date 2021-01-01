const express = require('express'); // express
const path = require('path');
const http = require('http');
const compression = require('compression'); // compression
const helmet = require('helmet');
const fs = require('fs');

const app = express();  // express server
const httpServer = http.createServer(app);
const io = require('socket.io')(httpServer, {
    cors: {
        origin: '*',
    }
});    // initialize socket.io for server

const port = 3000;

app.use(express.static('client/build'));
app.use(compression());
app.use(helmet());

// on getting root directory
app.get('/', (request, response) => {
    response.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    response.sendFile(path.join(__dirname, 'client/build/index.html'));
});

// handler to initiating new connection with a client
io.on('connection', (socket) => {
    console.log(`New socket connection of ID: ${socket.id}.`);
    socket.emit('connection', null);
});

app.listen(port, () => {
    console.log(`Listening on port ${port}:`);
});