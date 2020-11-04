let express = require('express');
let path = require('path');
let app = express();
let port = 5000;

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/', (req, res) => {
    res.send('Home');
    //res.sendFile(path.join(__dirname, '/client/src/index.js'));
});

// check if the server is connected to React
app.get('/express_backend', (req, res) => {
    res.send({express: 'Your express backend is connected to React'});
});

// signup page
app.get('/signup', (req, res) => {

});

// login page
app.get('/login', (req, res) => {

});

app.listen(port, () => {

});