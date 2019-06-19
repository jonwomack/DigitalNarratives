var http = require('http'), fs = require('fs');
var url = require('url');
var path = require('path');
var express = require('express');
var port = process.env.PORT || 3000;

var app = express();
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname)));


//app.use('/home/src/CSS/', express.static('src/CSS'));
//app.use('/home/src/JavaScript/', express.static('src/JavaScript'));
app.use('/CSS/', express.static('src/CSS'));
app.use('/JavaScript/', express.static('src/JavaScript'));
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/src/index.html');
});
app.get('/home', function (req, res) {
    res.sendFile(__dirname + '/src/index.html');
});
app.get('/create', function (req, res) {
    res.sendFile(__dirname + '/src/create.html');
});
app.get('/database', function (req, res) {
    res.sendFile(__dirname + '/src/database.html');
});
app.get('/engage', function (req, res) {
   res.sendFile(__dirname + '/src/engage.html')
});
app.listen(port);

