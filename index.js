const express = require('express'); // express
const path = require('path');
const http = require('http');
const compression = require('compression'); // compression
const helmet = require('helmet');
const fs = require('fs');
const cors = require('cors');

const port = 3000;

const app = express();  // express server

const httpServer = http.createServer(
    //{key: fs.readFileSync('certs/server.key', 'utf8'), 
    //cert: fs.readFileSync('certs/server.crt', 'utf8'),}, 
    app);

let origins = ['http://localhost:3000', 'http://web-app.li-vincent.com:3000'];
let corsOps = {
    origin: (origin, callback) => {
        if(origins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}

const io = require('socket.io')(httpServer, cors(corsOps));    // initialize socket.io for server

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

httpServer.listen(port, () => {
    console.log(`Listening on port ${port}:`);
});