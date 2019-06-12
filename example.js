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











var retext = require('retext');
var keywords = require('retext-keywords');
var toString = require('nlcst-to-string');


var StoryTemplate = 'I parked my ferrari in the lot.';
var test3 = 'I walked my dog in the lot';
var sentences = [test3];
var finalStory = StoryTemplate;


var temp = [];
var currKey = [];
var maxMatches = [];
var contextSentence = [];

function done(err, file) {
    if (err) throw err

    let keywords = [];
    file.data.keywords.forEach(function(keyword) {
        keywords.push(toString(keyword.matches[0].node));
        //console.log(toString(keyword.matches[0].node))
    });
    keywords.forEach(function (element) {
       temp.push(element);
    });
    /*
    console.log('Key-phrases:');
    file.data.keyphrases.forEach(function(phrase) {
        console.log(phrase.matches[0].nodes.map(stringify).join(''));
        function stringify(value) {
            return toString(value)
        }
    });
    */
}
function done2(err, file) {
    if (err) throw err

    let keywords = [];
    file.data.keywords.forEach(function(keyword) {
        keywords.push(toString(keyword.matches[0].node));
        //console.log(toString(keyword.matches[0].node))
    });
    keywords.forEach(function (element) {
        currKey.push(element);
    });
    /*
    console.log('Key-phrases:');
    file.data.keyphrases.forEach(function(phrase) {
        console.log(phrase.matches[0].nodes.map(stringify).join(''));
        function stringify(value) {
            return toString(value)
        }
    });
    */
}



let promise = new Promise(resolve => {
    retext().use(keywords).process(StoryTemplate, done);
    setTimeout(() => resolve(temp), 500);
});
promise.then(function(templateKeywords) {
    nextSentence(sentences, 0, templateKeywords);
});
function nextSentence(sentences, curr, templateKeywords) {
    if (curr < sentences.length) {
        let promise = new Promise(resolve => {
            retext().use(keywords).process(sentences[curr], done2);
            setTimeout(() => resolve(currKey), 500);
        });
        promise.then(function(currKey) {
            compareKeywords(templateKeywords, currKey, sentences[curr]);
            nextSentence(sentences, curr + 1, templateKeywords);
        });
    } else {
        console.log(maxMatches);
        console.log(templateKeywords);
        console.log(contextSentence);
        for (var i = 0; i < templateKeywords.length && i < maxMatches.length; i++) {
            finalStory = finalStory.replace(templateKeywords[i], maxMatches[i]);
        }
        console.log(finalStory);
    }
}

function compareKeywords(templateKeywords, currKey, currSentence) {
    let matches = 0;
    templateKeywords.forEach(function (elementT) {
       currKey.forEach(function (elementC) {
           if (elementC.toLowerCase() === elementT.toLowerCase()) {
               matches++;
           }
       })
    });
    if (matches > maxMatches.length) {
        maxMatches = [];
        contextSentence = currSentence;
        currKey.forEach(function(element) {
           maxMatches.push(element);
        });
    }
    while (currKey.length > 0) {
        currKey.splice(0,1);
    }
}