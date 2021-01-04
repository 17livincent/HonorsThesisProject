const express = require('express'); // express
const path = require('path');
const cors = require('cors');

const port = 3000;
const app = express();  // express server

app.use(express.static('client/build'));
app.use(require('compression')());
app.use(require('helmet')());
app.use(cors());

const httpServer = require('http').createServer(app);

const io = require('socket.io')(httpServer, {
    cors: {
        origin: 'localhost:3000',
        methods: ['GET', 'POST']
    }
});    // initialize socket.io for server

// on getting root directory
app.get('/', (request, response) => {
    response.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    response.sendFile(path.join(__dirname, 'client/build/index.html'));
});

// handler to initiating new connection with a client
io.on('connection', (socket) => {
    console.log(`${socket.id}: Connected.`);
    socket.emit('connection');

    socket.on('submit', (data, callback) => {
        console.log(`${socket.id}: Submitted: ${JSON.stringify(data)}.`);
        callback('Acknowledged');
    });

    socket.on('disconnect', () => {
        console.log(`${socket.id}: Disconnected.`);
    });
});

httpServer.listen(port, () => {
    console.log(`Listening on port ${port}:`);
});