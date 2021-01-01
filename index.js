const express = require('express'); // express
const path = require('path');
const compression = require('compression'); // compression
const helmet = require('helmet');

const app = express();  // express server
const server = require('http').createServer(app);  // http
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});    // initialize socket.io for server

const port = 3000;

app.use(express.static('client/build'));
app.use(compression());
app.use(helmet());

server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

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