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
        methods: ['GET', 'POST'],
        allowedHeaders: ['steps', 'num of files', 'file chunk', 'submit'],
        credentials: true
    }
});    // initialize socket.io for server

let clients = [];   // list of clientForms

let clientForm = {  // details associated with a connected client
    id: null,   // socket ID
    steps: null,    // sent steps
    files: [],   // sent files
    numOfFiles: 0,  // number of files that will be sent by server
    numOfReceivedFiles: 0   // number of files fully received
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

    // received steps from client
    socket.on('steps', (stepsSubmitted, callback) => {
        //console.log(`${socket.id}: Submitted steps: ${stepsSubmitted}`);
        // ack steps
        callback(`Acknowledged steps`);
        // add steps to clientForm
        for(let i in clients) {
            if(clients[i].id === socket.id) {
                clients[i].steps = stepsSubmitted;
                break;
            }
        }
        //console.log(clients);
    });

    // received number of files
    socket.on('num of files', (numSubmitted, callback) => {
        callback('Acknowledged number of files');
        // find client
        for(let i in clients) {
            if(clients[i].id === socket.id) {
                clients[i].numOfFiles = numSubmitted;
                break;
            }
        }
    })

    // received file chunk from client
    socket.on('file chunk', (fileChunk, callback) => {
        callback(`Acknowledged file chunk`);
        // add filechunk to clientForm
        // find client
        let cIndex;
        let fIndex;
        for(let i in clients) {
            if(clients[i].id === socket.id) {
                cIndex = i;
                break;
            }
        }
        // if there are no files for this client yet
        if(clients[cIndex].files.length === 0) {
            // push this filechunk to files
            clients[cIndex].files.push(fileChunk);
            fIndex = 0;
        }
        else {
            // find the existing file with the same filename
            for(let j in clients[cIndex].files) {
                if(clients[cIndex].files[j].name === fileChunk.name) {
                    fIndex = j;
                    break;
                }
            }
            if(fIndex === undefined) { // if this is the first filechunk for this file
                // push this filechunk to files
                clients[cIndex].files.push(fileChunk);
                fIndex = clients[cIndex].files.length - 1;
            }
            else {
                let data = clients[cIndex].files[fIndex].data;
                clients[cIndex].files[fIndex].data = Buffer.concat([data, fileChunk.data]); 
            }
        }
        // check if the file has all of its chunks
        if(clients[cIndex].files[fIndex].data.length === clients[cIndex].files[fIndex].size) {
            console.log('Full file received');
            // increment client's numOfReceivedFiles
            clients[cIndex].numOfReceivedFiles++;
            console.log(clients[cIndex]);
        }
        // check if the client has sent all files
        if(clients[cIndex].numOfFiles !== 0 
            && clients[cIndex].numOfFiles === clients[cIndex].numOfReceivedFiles
            && clients[cIndex].steps !== null) {
            // send request to submit
            socket.emit('ready to submit');
        }
    });

    // received submit from client
    socket.on('submit', (callback) => {
        console.log('Submitted');
        // find this client's info
        let cIndex;
        for(let i in clients) {
            if(clients[i].id === socket.id) {
                cIndex = i;
                break;
            }
        }
        callback(`Acknowledged submit: ${clients[cIndex]}`);
        console.log(clients[cIndex].files);
    });

    // client disconnected
    socket.on('disconnect', () => {
        console.log(`${socket.id}: Disconnected.`);
        // remove corresponding clientForm
        for(let i in clients) {
            if(clients[i].id === socket.id) {
                // delete files
                clients[i].files.splice(0, clients[i].files.length);
                // remove client
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