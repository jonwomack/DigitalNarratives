var http = require('http'), fs = require('fs');

/*
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('Hello World!');
}).listen(8080);
*/
let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
fs.readFile('./src/ARWorld/arworld.html', function (err, html) {
    if (err) {
        throw err;
    }
    http.createServer(function(request, response) {
        response.writeHeader(200, {"Content-Type": "text/html"});
        response.write(html);
        response.end();
    }).listen(port);
});

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
