var currLat;
var currLon;
var currAlt;
let tempLat;
let tempLon;
let tempAlt;
var currHeading;
var currX;
var currZ;
var initLat;
var initLon;
var initAlt;
var initHeading;
var init = false;

const cam = document.getElementById("camera");
const demo = document.getElementById("demo");
const hello = document.getElementById("hello");


const username = localStorage.getItem("username");
const password = localStorage.getItem("password");


//Storing Position i.e. starting AR world
async function getLocation() {
    let promise = new Promise(resolve => {
        let exists = false;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(storePosition);
            if (currLat != null && currLon != null && currAlt != null) {
                exists = true;
            }
        } else {
            demo.innerHTML = "Geolocation is not supported by this browser.";
        }
        setTimeout(() => resolve(exists), 500); // resolve
    });

    // wait for the promise to resolve
    let value = await promise;
    return value;
}

function storePosition(position) {
    currLat = 33.771413;
    currLon = -84.389291;
    currAlt = 291;

    /*
    currLat = position.coords.latitude;
    currLon = position.coords.longitude;
    currAlt = position.coords.altitude;
    */

    tempLat = currLat;
    tempLon = currLon;
    tempAlt = currAlt;
    if (currLat == null || currLon == null || currAlt == null) {
        demo.innerHTML = "Lat, Lon, or Alt isn't storing";
    }
    currHeading = 0;
    //calculateHeading();
    if (init === false) {
        initLat = currLat;
        initLon = currLon;
        initAlt = currAlt;
        initHeading = currHeading;
        init = true;
    }

    currX = 0;
    currZ = 0;
    cam.setAttribute('position', {
        x: currX,
        y: currAlt,
        z: currZ
    });
}
storePosition();
//setInterval(function() {updatePosition(); }, 3000);
//Updating the Position - Occurs every 3 seconds and only updates if you move more than 7 meters
function updatePosition() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(updatePositionHelper);
    } else {
        demo.innerHTML = "Geolocation cannot be updated.";
    }
}
function updatePositionHelper(position) {
    tempLat = currLat;
    tempLon = currLon;
    //tempLat = position.coords.latitude;
    //tempLon = position.coords.longitude;
    //tempAlt = position.coords.altitude;
    let changeInXDistance = calculateDistance(tempLat, currLat, tempLon, currLon);
    let changeInYDistance = tempAlt - currAlt;
    let changeInTotalDistance = Math.sqrt(Math.pow(changeInXDistance, 2) + Math.pow(changeInYDistance, 2));
    if (changeInTotalDistance > 5) {
        currLat = tempLat;
        currLon = tempLon;
        currAlt = tempAlt;
        let changeInBearing = calculateBearing(tempLat, currLat, tempLon, currLon);
        currX = currX + changeInXDistance * Math.sin(toRadians(changeInBearing));
        currZ = currZ + changeInXDistance * -1 * Math.cos(toRadians(changeInBearing));
        cam.setAttribute('position', {
            x: currX,
            y: currAlt,
            z: currZ
        });
    }
}

function placeObjs() {
    var objects = firebase.database().ref('objects');
    objects.once('value').then(function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            let objectName = childSnapshot.key;
            let object = `${childSnapshot.key}`;
            if (snapshot.child(object + '/public').val()) {
                let latitude = snapshot.child(object + '/latitude').val();
                let longitude = snapshot.child(object + '/longitude').val();
                let altitude = snapshot.child(object + '/altitude').val();
                let objectCreator = snapshot.child(object + '/username').val();
                if (snapshot.child(object +'/type').val() === 'txt') {
                    let fileName = snapshot.child(object + '/text').val();
                    console.log(fileName);
                    createObjectTxt(latitude, longitude, altitude, fileName);
                }
            }
        });
    });
}


async function createObjectTxt(objLatitude, objLongitude, objAltitude, fileName) {
    let positioned = await getLocation();
    if (positioned) {
        let distance = calculateDistance(currLat, objLatitude, currLon, objLongitude);
        if (distance < 125000) {
            let bearing = currHeading + calculateBearing(currLat, objLatitude, currLon, objLongitude);
            let x = distance * Math.sin(toRadians(bearing));
            let y = objAltitude;
            let z = distance * -1 * Math.cos(toRadians(bearing));
            let el = document.createElement('a-entity');
            el.setAttribute('text', {
                value: fileName
            });
            //el.object3D.scale.set(.1, .1, .1);
            el.setAttribute('position', {
                x: x,
                y: y,
                z: z
            });
            let sceneEl = document.querySelector('a-scene');
            sceneEl.appendChild(el);
        }
    }
}


//Sets current heading as the difference between North and user heading.
function calculateHeading() {
    if (window.DeviceOrientationEvent) {
        window.addEventListener("deviceorientation", function (event) {
            if ('ondeviceorientationabsolute' in window) {
                window.ondeviceorientationabsolute = function(event) {
                    currHeading = event.alpha;
                    return true;
                };
            } else if(event.webkitCompassHeading) {
                var compass = event.webkitCompassHeading;
                handleOrientationEvent(compass);
                return true;
            } else if (event.absolute == true) {
                var compass = event.alpha;
                handleOrientationEvent(compass);
                return true;
            } else {
                demo.innerHTML = "<br>Compass Heading Not Working";
                return false;
            }
        }, true);
    } else {
        demo.innerHTML = "<br>Compass Heading Not Working";
        return false;
    }
}
function handleOrientationEvent(compass) {
    currHeading = compass;
}
function toDatabase() {
    location.assign('../database');
}
function teleport() {
    let lat = parseFloat(document.getElementById("teleLat").value);
    let lon = parseFloat(document.getElementById("teleLon").value);
    let changeInBearing = calculateBearing(lat, currLat, lon, currLon);
    let changeInXDistance = calculateDistance(lat, currLat, lon, currLon);
    currX = currX + changeInXDistance * Math.sin(toRadians(changeInBearing));
    currZ = currZ + changeInXDistance * Math.cos(toRadians(changeInBearing));
    cam.setAttribute('position', {
        x: -currX,
        y: currAlt,
        z: currZ
    });
    currLat = lat;
    currLon = lon;
}
var contentInterval;
var timerInterval;
var nodes;
var distanceNode = [Number.MAX_SAFE_INTEGER, "", []]; //Node that is closest to user.
var currentTemplateKeywords = [];
let genre;

function begin() {
    genre = document.getElementById("genreType").options[document.getElementById("genreType").selectedIndex].value;
    console.log(genre);
    /*
    let objects = firebase.database().ref('models');

    network = ;
    */
    /*

    let net2 = new brain.NeuralNetwork().fromJSON(json);
    console.log(brain.likely({laboratory: 1, experiment: 1}, net2));
    */
    let sentences = grabSentences("He was more and more a wizard each day now. He even had a staff, tall as he was, that he had found where the tracks wound through the trees a few days back. The pale wood had strange symbols in it, like the magic wand he found in his backyard once Before. Dad had said the symbols weren't carved, just the chewed tracks of bark beetles, but that was because Dad hadn't believed in magic." +
        "The wizard knew it was real." +
        "The road was falling apart, too bumpy to walk on anymore, so he'd taken the railroad tracks instead. On and on they went, without the curves of the blacktop, and the telephone poles marched alongside them. The wires hanging from the poles were empty, and so were the wires leading to the dark lights in the towns, or to the TVs and fridges and stuff in people's homes. He felt their emptiness. Empty, empty, empty." +
        "Maybe that was why all the people were gone." +
        "He didn't mind. He liked being alone, playing by himself. He was a little hungry, but lots of people had left their doors open, or if they hadn't, there were always windows that could be opened with rocks. He always knew when houses had cupboards full of food, just like he knew the wires were empty." +
        "Because he was a wizard." +
        "He walked along the train tracks, swinging his wand, and fat ravens gathered on the empty wires to watch him." +
        "Jenna had never spent a night outdoors until the world ended. She still wasn't used to it, and her inexperience showed." +
        "Unfortunate but ready example: the tent she pitched the night before had collapsed just as Aaron and Becca enjoyed some private time inside. From their looks, neither of them had forgiven her for it yet, and neither had Royce. Royce wasn't in the collapsing tent, but he'd come out of his own to help uncover Aaron and Becca from the ruins. He was too stoic for Jenna to imagine the exertion bothering him much; he was probably unhappy with her because it was the leader's job to be unhappy with incompetence." +
        "She really was sorry." +
        "Why can't we just sleep in houses? she asked. It's not as if enough of them aren't abandoned." +
        "Because she was trailing behind the main group she hadn't expected any of them to hear her, but Royce looked over his shoulder and said, There are things in houses." +
        "He had ears like a hawk, or maybe that guy from Poe who heard the telltale heart. Part of why he was the leader." +
        "Right, Jenna said, regretting the burst of combined ill temper and wishful thinking that had prompted the question. I know. Sorry." +
        "He turned back--hadn't missed a step on the uneven railroad ties even while glaring at her--and kept walking." +
        "Then they left her in peace, which was really the kindest thing under the circumstances. Shame was the most efficient punishment, but like baking soda on a stain it should be left to soak in on its own before scrubbing. She didn't doubt Royce, or maybe Gloria, would get at her with a scrub brush soon enough." +
        "God, if He was still in the office and not using up His sick days during the end of the world, continued to work as mysteriously as He always did. Because she was trailing behind, Jenna saw the boy first as he climbed up the rocky embankment to the tracks, and because she was numb with persisting embarrassment, she didn't yelp or run towards him or any of the myriad things that would have frightened him away.");
    let sentences2 = grabSentences("No one knew why they came, and in the end, it didn't matter. They came, and that bald fact alone was all the human race needed to know." +
        "We could deduce certain things about them. They were bold, they were advanced, and they were not given to subtlety. They had a single, obvious message for us, and they hit us over the head with it. They must have been monitoring us for many years because when the day came all they had to do was show themselves and leave everything else up to us." +
        "I was driving an air cab on the run between Coogee and Circular Quay when they arrived. They were a bit hard to miss. First the city air traffic net lit up like Christmas, then people started screaming, and everything in the air was ordered down. I saw Police aircars with their spinners flickering herding drivers out of the air, and I put my cab down on the skypad of the Zhen Yun Hotel tower, overlooking Sydney harbor, half a kay back from The Rocks, by the bridge, and copped one of the best views imaginable. Or worst, if you felt that way." +
        "My fare was a young lass on her way to an event at the Opera House and she was as dumbstruck as me; we sat under the long clear canopy of my cab and stared at the sky, gaping like goldfish, as the alien vessel made its appearance. It seemed to fill the sky from horizon to horizon, the clouds swirling and parting before it, sharp cracks of lightning around it as its motion created vast static potential. It was intricately detailed with mechanisms unguessable, its design seemed to follow no logic the human mind could comprehend, at least as abstract or aesthetic as functional; and it was black as hell, or just blocked out the daylight of a cloudy afternoon and hung over us like the stroke of doom." +
        "My fare climbed over from the back into the seat beside me for a better view and at last offered her hand without taking her eyes from the thing. Jody, she whispered." +
        "Craig, I returned, as softly. People sat in their craft all around us, the pad was now packed and others were turned away, sent racing for other landfalls or just out of the city as fast as they could move. From the corner of my eye I saw Jody take out her mobile and start imaging the alien, and realized people had their phones raised to the sky in most vehicles around us." +
        "We waited for the streams of light to fall, for the fires and chaos, the devastation--it was obvious we were helpless before them. For a good twenty minutes we expected to die. I saw a guy in the next car praying, a rosary at his lips, and knew others throughout the city would be doing the same--prayer mats and shawls, sidewalk services, Muslims facing Mecca. But after half an hour we were getting bored, and many began to leave their vehicles, walk to the safety rails at the edge of the roof for a better view, and chat." +
        "What can I say? The alien ship must have been over a dozen kilometers long, it was up there, and it didn't do a damned thing. Not an overt act, not a blinking light pattern, nor a voice of thunder from the heavens. It just hung there, as if it was saying, you think you're so smart? What do you make of this? Take your time, kiddies, you've got plenty of it.");
    //aye(0,sentences2, genre);

    let models = firebase.database().ref('/models/' + genre + '/json/json');
    models.once('value').then(function(snapshot) {
        console.log(snapshot.val());
        jsonModel(snapshot.val());
    });

}

function nextNode() {
    let objects = firebase.database().ref('objects');
    objects.once('value').then(function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            let object = `${childSnapshot.key}`;
            if (snapshot.child(object + '/public').val()) {
                let lat = snapshot.child(object + '/latitude').val();
                let lon = snapshot.child(object + '/longitude').val();
                let distance = calculateDistance(currLat, lat, currLon, lon);
                if (distance < distanceNode[0]) {
                    distanceNode = [distance, snapshot.child(object + '/text').val()];
                }
            }
        });
        keywords(distanceNode[1]).then(function(result) {
            distanceNode[2] = result;
            console.log(distanceNode[1]);
            console.log("Distance Keywords: " + distanceNode[2]);
            document.getElementById("currNode").innerText = "";
            let map = new Map();
            result.forEach(function(element) {
                map.set(element, 1);
            });
            let obj = Object.fromEntries(map);
            run(obj, genre);
        });







    });
    distanceNode = [Number.MAX_SAFE_INTEGER, "", []];
}

let arr = [];
function aye(number, sentences, genre) {
    console.log(number + ": " + sentences[number]);
    firebase.database().ref('models/' + genre + '/sentences/' + number).set({
        content: sentences[number]
    });
    keywords(sentences[number]).then(function(result) {
        let map = new Map();
        console.log(result);
        result.forEach(function(element) {
            map.set(element.toLowerCase(), 1);
        });
        let obj = Object.fromEntries(map);
        let map2 = new Map();
        map2.set(`${number}`, 1);
        let obj2 = Object.fromEntries(map2);
        let map3 = new Map();
        map3.set("input", obj);
        map3.set("output", obj2);
        let obj3 = Object.fromEntries(map3);
        arr.push(obj3);
        if (number + 1 < sentences.length) {
            aye(number + 1, sentences, genre);
        } else {
            uploadModel(genre, arr);
        }
    });
}






