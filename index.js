const express = require('express'); // express
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const port = 3000;
const app = express();  // express server

app.use(express.static('client/build'));
app.use(require('compression')());
app.use(require('helmet')());
app.use(cors());

const httpServer = require('http').createServer(
    //{key: fs.readFileSync('certs/server.key', 'utf8'), 
    //cert: fs.readFileSync('certs/server.crt', 'utf8'),}, 
    app);

const io = require('socket.io')(httpServer, cors({origin: '*'}));    // initialize socket.io for server

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