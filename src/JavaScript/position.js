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


const templates = [
    "It was a laboratory experiment gone wrong. It was a laboratory experiment gone right... " +
    "This whole thing surprisingly began with a magic show in Vegas. " +
    "The show was all about misdirection. Allusion. Getting into the audience's head. " +
    "I was determined not to be got, but I still let myself enjoy the show. " +
    "Rabbits came out of hats, the magician's lovely assistant was split in half, " +
    "and Mr.Houdini performed his infamous escape act. Once the show finished, I made sure to stick around." +
    " Houdini left the green room, no longer in magician attire." +
    " I inquired about how he performs his tricks. " +
    "Naturally, he said \"A magician never reveals his secrets\". " +
    "$1,500 later, he did. Apparently, all of it is dependent on accessing and triggering the subconscious of the audience." +
    " For example, a snap of the fingers, a ring of a bell, or the incantation of a phrase. " +
    "With this information, I headed back to Atlanta." +
    "In the lab the next day, I began planning an experiment that would combine the subconscious engagement of a magic show with the ubiquity of digital media." +
    " I had a suspicion that this experiment was on the edge of being unethical, but the promise of this level of control was too good to pass up." +
    " Plus, if I didn’t do it, someone else would. " +
    "The experiments began. Our first subject was Lucy Nzambi, an undergraduate student from Brazil looking to make some easy money. " +
    "She was hooked up to an electroencephalogram while she started playing the phone application." +
    " The game was three levels of increasing difficulty. " +
    "Level One: normal brain activity." +
    " Lucy was psyched to be offsetting her tuition expenses." +
    " Level Two: a lull in activity in the prefrontal cortex." +
    " This was an exciting result. Level Three: a complete shutdown of the prefrontal cortex." +
    " I went to go remove Lucy from the EEG. She was still tranced." +
    " Something was wrong. I called out to the lab assistants because Lucy was looking aggressive and nothing I said resonated with her. " +
    "As she began approaching us, the assistants looked to restrain her. " +
    "Then Lucy bit into the assistant on the left. " +
    "Blood was shooting everywhere, I hit the alarm on the building, and we fled the scene."
];


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
    currLat = 33.776493;
    currLon = -84.400088;
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
let template = templates[document.getElementById("templateType").options[document.getElementById("templateType").selectedIndex].value];

async function begin() {
    contentInterval = setInterval(function() {
        if (template.length > 0) {
            let currSentence = template.substring(0, template.indexOf(".") + 1);
            currentTemplateKeywords.length = 0;
            keywords(currSentence).then(function(result) {
                result.forEach(function(keyword) {
                   currentTemplateKeywords.push(keyword);
                });
                let objects = firebase.database().ref('objects');
                objects.once('value').then(function (snapshot) {
                    snapshot.forEach(function (childSnapshot) {
                        let object = `${childSnapshot.key}`;
                        if (snapshot.child(object + '/public').val()) {
                            let lat = snapshot.child(object + '/latitude').val();
                            let lon = snapshot.child(object + '/longitude').val();
                            let distance = calculateDistance(currLat, lat, currLon, lon);
                            if(distance < distanceNode[0]) {
                                distanceNode = [distance, snapshot.child(object + '/text').val()];

                            }
                        }
                    });
                    keywords(distanceNode[1]).then(function(result) {
                        distanceNode[2] = result;
                        console.log(currSentence);
                        console.log("Template Keywords: " + currentTemplateKeywords);
                        console.log(distanceNode[1]);
                        console.log("Distance Keywords: " + distanceNode[2]);
                        let i = 0;
                        while (i < currentTemplateKeywords.length && i < distanceNode[2].length) {
                            currSentence = currSentence.replace(currentTemplateKeywords[i], distanceNode[2][i]);
                            i++;
                        }
                        document.getElementById("currNode").innerText = currSentence;
                    });
                });
            });
            /*

            */
            template = template.substring(template.indexOf(".") + 1);
            distanceNode = [Number.MAX_SAFE_INTEGER, "", []];
        } else {
            clearInterval(contentInterval);
        }
    }, 5000);
    /*
    timerInterval = setInterval(function() {
        countDown();
    }, 1000);
    */


}
function countDown() {
    let timer = document.getElementById("timer");
    timer.innerText = parseInt(timer.innerText) - 1;
    if (timer.innerText == 5) {
    }
    if (timer.innerText == -1) {
        //clearInterval(timerInterval);
        timer.innerText = 5;
    }
}


function nextNode() {
        if (template.length > 0) {
            let currSentence = template.substring(0, template.indexOf(".") + 1);
            currentTemplateKeywords.length = 0;
            keywords(currSentence).then(function(result) {
                result.forEach(function(keyword) {
                    currentTemplateKeywords.push(keyword);
                });
                let objects = firebase.database().ref('objects');
                objects.once('value').then(function (snapshot) {
                    snapshot.forEach(function (childSnapshot) {
                        let object = `${childSnapshot.key}`;
                        if (snapshot.child(object + '/public').val()) {
                            let lat = snapshot.child(object + '/latitude').val();
                            let lon = snapshot.child(object + '/longitude').val();
                            let distance = calculateDistance(currLat, lat, currLon, lon);
                            if(distance < distanceNode[0]) {
                                distanceNode = [distance, snapshot.child(object + '/text').val()];

                            }
                        }
                    });
                    keywords(distanceNode[1]).then(function(result) {
                        distanceNode[2] = result;
                        console.log(currSentence);
                        console.log("Template Keywords: " + currentTemplateKeywords);
                        console.log(distanceNode[1]);
                        console.log("Distance Keywords: " + distanceNode[2]);
                        let i = 0;
                        while (i < currentTemplateKeywords.length && i < distanceNode[2].length) {
                            currSentence = currSentence.replace(currentTemplateKeywords[i], distanceNode[2][i]);
                            i++;
                        }
                        document.getElementById("currNode").innerText = currSentence;
                    });
                });
            });
            template = template.substring(template.indexOf(".") + 1);
            distanceNode = [Number.MAX_SAFE_INTEGER, "", []];
        }
}






