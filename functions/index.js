const functions = require('firebase-functions');
const express = require('express');
const path = require('path');

const app = express();

app.use(express.static('/../client/build'));

app.get('/', (request, response) => {
    response.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    response.sendFile(path.join(__dirname, '/../client/build/index.html'));
});
/*
app.get('*', (request, response) => {
    response.sendFile(path.join(__dirname, '/../client/build/404.html'));
});
*/
exports.app = functions.https.onRequest(app);