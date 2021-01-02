const express = require('express'); // express
const path = require('path');
const https = require('https');
const compression = require('compression'); // compression
const helmet = require('helmet');
const fs = require('fs');

const port = 443;

const app = express();  // express server

const httpsServer = https.createServer(
    {key: fs.readFileSync('certs/server.key', 'utf8'), 
    cert: fs.readFileSync('certs/server.crt', 'utf8'),}, app);

const io = require('socket.io')(httpsServer, {
    cors: {
        origin: '*'
    }
});    // initialize socket.io for server

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

httpsServer.listen(port, () => {
    console.log(`Listening on port ${port}:`);
});