
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
    /*
    while (currentTemplateKeywords.length > 0) {
        currentTemplateKeywords.splice(0,1);
        console.log(currentTemplateKeywords);
    }
    while (distanceNode[2].length > 0) {
        distanceNode[2].splice(0,1);
        console.log(distanceNode[2]);
    }
    */
    let promise = new Promise(resolve => {
        retext().use(keywords).process(sentence, done3);
        setTimeout(() => resolve(kw), 500);
    });

    const trainingData = [
        'Little Red Riding Hood is taking food to her sick grandmother.',
        'Little Red Riding Hood encounters a wolf along the way.',
        'The wolf tells Red Riding Hood to pick flowers.',
        'The wolf eats Red Riding Hood’s grandmother.',
        'The wolf pretends to be the grandmother.',
        'The wolf eats Red Riding Hood.',
        'A huntsman finds the wolf in Grandma’s house.',
        'He cuts open the wolf to save Grandma and Red Riding Hood.',
        'Red Riding Hood decides to never stray in the forest again.',
        'laboratory experiment is very fun.',
        'laboratory experiment is not fun.',
        'I went to a laboratory experiment one time.',
        'Jane saw Doug.',
        'Doug saw Jane.',
        'Spot saw Doug and Jane looking at each other.',
        'It was love at first sight, and Spot had a frontrow seat. It was a very special moment for all.'

    ];

    const net = new brain.recurrent.LSTM();
    net.train(trainingData, {
        iterations: 1500,
        errorThresh: 0.011
    });
    const run1 = net.run('Jane');
    const run2 = net.run('Doug');
    const run3 = net.run('Spot');
    const run4 = net.run('It');
    net.maxPredictionLength = 1000;
    console.log(net.run('laboratory experiment'));
    console.log('run 1: Jane' + run1);
    console.log('run 2: Doug' + run2);
    console.log('run 3: Spot' + run3);
    console.log('run 4: It' + run4);
    console.log('run 5: Jane Doug' + net.run('Jane Doug'));
    return await promise;
}
