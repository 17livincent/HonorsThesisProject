const functions = require('firebase-functions');    // firebase functions

const express = require('express'); // express
const path = require('path');

const app = express();  // express server
const server = require('http').createServer(app);  // http
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});    // initialize socket.io for server

const port = 3000;

server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

app.use(express.static('/../client/build'));

// on getting root directory
app.get('/', (request, response) => {
    response.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    response.sendFile(path.join(__dirname, '/../client/build/index.html'));
});

// handler to initiating new connection with a client
io.on('connection', (socket) => {
    console.log(`New socket connection of ID: ${socket.id}.`);
    socket.emit('connection', null);
});

// include app as firebase cloud function
exports.app = functions.https.onRequest(app);