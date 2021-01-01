const express = require('express'); // express
const path = require('path');
const compression = require('compression'); // compression
const helmet = require('helmet');
const https = require('https');
const fs = require('fs');

const app = express();  // express server
const httpsServer = https.createServer({
    key: fs.readFileSync('certs/server.key'),
    cert: fs.readFileSync('certs/server.crt')
}, app);  // https
const io = require('socket.io')(httpsServer, {
    cors: {
        origin: '*',
    }
});    // initialize socket.io for server

const port = 3000;

app.use(express.static('client/build'));
app.use(compression());
app.use(helmet());

httpsServer.listen(port, () => {
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