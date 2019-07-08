
var retext = require('retext');
var keywords = require('retext-keywords');
var toString = require('nlcst-to-string');
var brain = require('brain.js');

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
function done3(err, file) {
    if (err) throw err

    let keywords = [];
    file.data.keywords.forEach(function(keyword) {
        keywords.push(toString(keyword.matches[0].node));
        //console.log(toString(keyword.matches[0].node))
    });

    keywords.forEach(function (element) {
        kw.push(element);
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


function nextSentence(sentences, curr, templateKeywords, finalStory) {
    if (curr < sentences.length) {
        function moveForward2(curr, templateKeywords, sentences, finalStory, currKey) {
            console.log("sentences: " + sentences);
            console.log("Template Keywords: " + templateKeywords);
            console.log("Final Story: " + finalStory);
            console.log("CurrKey: " + currKey);
            console.log("Curr: " + curr);
            compareKeywords(templateKeywords, currKey, sentences[curr]);
            nextSentence(sentences, curr + 1, templateKeywords, finalStory);
        }
        let promise = new Promise(resolve => {
            retext().use(keywords).process(sentences[curr], done2);
            setTimeout(() => resolve(currKey), 500);
        });
        promise.then(moveForward2.bind(null, curr, templateKeywords, sentences, finalStory));
    } else {
        for (var i = 0; i < templateKeywords.length && i < maxMatches.length; i++) {
            finalStory = finalStory.replace(templateKeywords[i], maxMatches[i]);
        }
        document.getElementById("currNode").innerText = finalStory;
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

window.test1 = function(StoryTemplate, sentences, finalStory) {
    let promise = new Promise(resolve => {
        retext().use(keywords).process(StoryTemplate, done);
        setTimeout(() => resolve(temp), 500);
    });
    function moveForward(sentences, finalStory, templateKeywords) {
        nextSentence(sentences, 0, templateKeywords, finalStory);
    }
    promise.then(moveForward.bind(null, sentences, finalStory));
}

let kw = [];
window.keywords = async function(sentence) {
    while (kw.length > 0) {
        kw.splice(0,1);
    }
    let promise = new Promise(resolve => {
        retext().use(keywords).process(sentence, done3);
        setTimeout(() => resolve(kw), 500);
    });
    return await promise;
}


var network;
window.run = function(obj, genre) {
    console.log(obj);
    let value = brain.likely(obj, network);
    console.log('models/' + genre + "/sentences/" + value)
    firebase.database().ref('models/' + genre + "/sentences/" + value).once('value').then(function(sentence) {
        let content = Object.values(sentence.val())[0];
        console.log(content);
        document.getElementById("currNode").innerText = content;
    });

}
window.jsonModel = function(json) {
    let net = new brain.NeuralNetwork();
    network = net.fromJSON(json);
}
window.grabSentences = function(string) {
    let sentences = [];
    while(string.length > 0) {
        let end = string.indexOf(".");
        if (end >= 0) {
            sentences.push(string.substring(0, end + 1));
            string = string.substring(end + 1);
        }
    }
    return sentences;
}

window.uploadModel = function(modelName, trainingInput) {
    let net = new brain.NeuralNetwork();
    /*
    let trainingInput = [
        {input: {laboratory: 1, experiment: 1}, output: {"1": 1}},
        {input: {laboratory: 0, experiment: 1}, output: {"4": 1}},
        {input: {laboratory: 0, experiment: 0}, output: {"2": 1}},
        {input: {home: 1, car: 1, wrist: 1}, output: {"5": 1}},
        {input: {Little: 1, Hood: 1, food: 1, grandmother: 1}, output: {"3": 1}}
    ];
    */
    net.train(trainingInput);
    let json = net.toJSON();
    let i;
    for (i in json['layers'][0]) {
        json['layers'][0][i] = 0;
    }
    let exists = false;
    let models = firebase.database().ref('/models/');
    models.once('value').then(function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            let modelnameDB = childSnapshot.key;
            if (modelnameDB === modelName) {
                exists = true;
            }
        });
        firebase.database().ref('models/' + modelName + '/json').set({
            json: json
        });
    });
}