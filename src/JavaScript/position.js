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
    currLat = 27.655791;
    currLon = -80.389219;
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
    let sentences = grabSentences("It was happening again." +
        "We all thought the rumors were just rumors." +
        "We started seeing the UFOs flying through the sky more frequently." +
        "The aliens left crop circles in the farm behind the forest."
);
   //aye(0,sentences, genre);

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






