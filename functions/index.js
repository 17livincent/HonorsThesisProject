const functions = require('firebase-functions');
const express = require('express');
const path = require('path');

const app = express();

const port = 3001;

app.use(express.static('/../client/build'));

app.get('/', (request, response) => {
    response.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    response.sendFile(path.join(__dirname, '/../client/build/index.html'));
});

app.listen(port, () => {
    console.log(`App is listening at port ${port}`);
});

exports.app = functions.https.onRequest(app);