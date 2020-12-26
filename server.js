const express = require('express');
const path = require('path');
const http = require('http');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

const server = http.createServer(app);
server.listen(port);