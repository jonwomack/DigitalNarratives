var http = require('http'), fs = require('fs');
var url = require('url');
var path = require('path');
var express = require('express');

var app = express();
app.set('view engine', 'ejs');
app.use('/home/src/CSS/', express.static('src/CSS'));
app.use('/', express.static('/'));
app.get('/home', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.listen(3000);

/*
var retext = require('retext');
var keywords = require('retext-keywords');
var toString = require('nlcst-to-string');


var doc = 'I am walking to the car.';
var doc2 = 'I am walking to the park.';
var doc3 = 'Car park';


retext().use(keywords).process(doc, done);
retext().use(keywords).process(doc2, done);
retext().use(keywords).process(doc3, done);


function done(err, file) {
    if (err) throw err

    console.log('Keywords:');
    file.data.keywords.forEach(function(keyword) {
        console.log(toString(keyword.matches[0].node))
    });

    console.log();
    console.log('Key-phrases:');
    file.data.keyphrases.forEach(function(phrase) {
        console.log(phrase.matches[0].nodes.map(stringify).join(''));
        function stringify(value) {
            return toString(value)
        }
    });
}
*/