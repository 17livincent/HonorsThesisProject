const express = require('express'); // express
const path = require('path');
const fs = require('fs');
const FileAPI = require('file-api');
const File = FileAPI.File;
const FileList = FileAPI.FileList;
const FileReader = FileAPI.FileReader;

const port = 3000;
const app = express();  // express server

app.use(express.static('client/build'));
app.use(require('compression')());
app.use(require('helmet')());
app.use(require('cors')());

const httpServer = require('http').createServer(app);

const io = require('socket.io')(httpServer, {
    cors: {
        origin: 'localhost:3000',
        methods: ['GET', 'POST']
    }
});    // initialize socket.io for server

let clients = [];   // list of clientForms

let clientForm = {  // details associated with a connected client
    id: null,   // socket ID
    steps: null,    // sent steps
    files: []   // sent files
}

// on getting root directory
app.get('/', (request, response) => {
    response.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    response.sendFile(path.join(__dirname, 'client/build/index.html'));
});

io.on('connection', (socket) => {   // when a new client has connected
    console.log(`${socket.id}: Connected.`);
    // record client
    let client = Object.assign({}, clientForm);
    client.id = socket.id;
    clients.push(client);
    console.log(clients);
    // ack connection
    socket.emit('connection');

    socket.on('steps', (stepsSubmitted, callback) => {
        console.log(`${socket.id}: Submitted steps: ${stepsSubmitted}`);
        // ack steps
        callback(`Acknowledged steps`);
        // add steps to clientForm
        for(let i in clients) {
            if(clients[i].id === socket.id) {
                clients[i].steps = stepsSubmitted;
                break;
            }
        }
        console.log(clients);
    });
    socket.on('submit', (callback) => {
        
    });
    socket.on('file chunk', (fileChunk, callback) => {
        callback('Acknowledged file chunk');
        console.log(fileChunk);
    });
    socket.on('disconnect', () => {
        console.log(`${socket.id}: Disconnected.`);
        // remove corresponding clientForm
        for(let i in clients) {
            if(clients[i].id === socket.id) {
                clients.splice(i, 1);
                break;
            }
        }
        console.log(clients);
    });
});

httpServer.listen(port, () => {
    console.log(`Listening on port ${port}:`);
});