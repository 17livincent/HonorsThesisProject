const express = require('express'); // express
const path = require('path');
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
        origin: 'web-app.li-vincent.com:3000',
        methods: ['GET', 'POST']
    }
});    // initialize socket.io for server

// on getting root directory
app.get('/', (request, response) => {
    response.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    response.sendFile(path.join(__dirname, 'client/build/index.html'));
});

io.on('connection', (socket) => {   // when a new client has connected
    console.log(`${socket.id}: Connected.`);
    socket.emit('connection');

    socket.on('submit', (steps, files, callback) => {   // client sent step info and base64-encoded files
        console.log(`${socket.id}: Submitted: ${JSON.stringify(steps)} with ${files.length} files.`);
        callback(`Acknowledged: ${JSON.stringify(steps)} with ${files.length} files`);  // acknowledge
        // reconstruct files into File objects from Buffer objects
        let filesReceived = [];
        for(let i in files) {
            let file = new File({
                name: files[i].name,
                buffer: Buffer.from(files[i].buffer),
                jsdom: true,
                async: true
            });
            filesReceived.push(file);
            console.log(file);
            /*
            let reader = new FileReader();
            reader.readAsText(file, 'utf-8');
            reader.addEventListener('load', () => {
                console.log(reader.result);
            });
            */
        }
        
        
    });
    socket.on('disconnect', () => {
        console.log(`${socket.id}: Disconnected.`);
    });
});

httpServer.listen(port, () => {
    console.log(`Listening on port ${port}:`);
});