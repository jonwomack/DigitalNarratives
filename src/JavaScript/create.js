var file;
//Testing


function insertObjectTxt() {
    let input = document.getElementById('insert3').value;
    console.log(input);
    let el = document.createElement('a-entity');
    el.setAttribute('text', {
        value: `${input}`,
    });
    el.setAttribute('id', 'moveable');
    el.setAttribute('position', {
        x: currX,
        y: currAlt,
        z: currZ - 1
    });
    el.className += "txt";
    let sceneEl = document.querySelector('a-scene');
    document.getElementById('insert3').addEventListener("input", function () {
        el.setAttribute('text', {
            value: `${this.value}`,
        });
    });
    sceneEl.appendChild(el);
    //disableInsertButtons();
}
setTimeout(function() {insertObjectTxt();}, 1000);

function disableInsertButtons() {
    document.getElementById("txtButton").disabled = true;
}



async function setObject() {
    let objName = document.getElementById("objName").value;
    let exists = await objExists(objName);
    if (!exists) {
        let el = document.getElementById('moveable');
        let x = el.getAttribute('position').x;
        let y = el.getAttribute('position').y;
        let z = el.getAttribute('position').z;
        let bearing = toDegrees(Math.atan2(-x , z));
        if (bearing < 0) {
            bearing = bearing + 360;
        }
        bearing = (bearing + 180) % 360;
        let distance = Math.sqrt((x * x) + (z * z));
        let latLon = calcLatLon(bearing, distance);
        let lat = latLon[0];
        let lon = latLon[1];
        if (el.className === 'txt') {
            console.log("Creating TXT");
            for (let i = 0; i < objTopics.length; i++) {
                console.log(objTopics[i]);
            }
            writeObjectDataTxt(objName, lat, lon, y, username, true, document.getElementById('insert3').value, objTopics);
        }
        //createFile(file, objName);
        //writeObjectDataGlb(objName, currLat, currLon, currAlt, username, true, file.name)
    } else {
        alert("Object Exists: Change Name");
    }

}
function writeObjectDataTxt(name, latitude, longitude, altitude, username, pub, fileName, topics) {
    firebase.database().ref('/objects/' + name).set({
        longitude: longitude,
        latitude: latitude,
        altitude: altitude,
        username: username,
        public: pub,
        type: 'txt',
        text: fileName,
        topics: topics
    });
}

async function objExists(name) {
    let promise = new Promise(resolve => {
        let object = false;
        let objects = firebase.database().ref(`objects`);
        objects.once('value').then(function (snapshot) {
            snapshot.forEach(function (childSnapshot){
                let objectName = childSnapshot.key;
                if (name === objectName) {
                    object = true;
                }
            });
        });
        setTimeout(() => resolve(object), 500);
    });
    let value = await promise;
    return value;
}
//Functions to move inserted object

function moveLeft() {
    let el = document.getElementById('moveable');
    let x = el.getAttribute('position').x;
    let y = el.getAttribute('position').y;
    let z = el.getAttribute('position').z;
    el.setAttribute('position', {
        x: x - .1,
        y: y,
        z: z
    });
}
function moveRight() {
    let el = document.getElementById('moveable');
    let x = el.getAttribute('position').x;
    let y = el.getAttribute('position').y;
    let z = el.getAttribute('position').z;
    el.setAttribute('position', {
        x: x + .1,
        y: y,
        z: z
    });
}
function moveForward() {
    let el = document.getElementById('moveable');
    let x = el.getAttribute('position').x;
    let y = el.getAttribute('position').y;
    let z = el.getAttribute('position').z;
    el.setAttribute('position', {
        x: x,
        y: y,
        z: z + .1
    });
}
function moveBackward() {
    let el = document.getElementById('moveable');
    let x = el.getAttribute('position').x;
    let y = el.getAttribute('position').y;
    let z = el.getAttribute('position').z;
    el.setAttribute('position', {
        x: x,
        y: y,
        z: z - .1
    });
}
function moveUp() {
    let el = document.getElementById('moveable');
    let x = el.getAttribute('position').x;
    let y = el.getAttribute('position').y;
    let z = el.getAttribute('position').z;
    el.setAttribute('position', {
        x: x,
        y: y + .1,
        z: z
    });
}
function moveDown() {
    let el = document.getElementById('moveable');
    let x = el.getAttribute('position').x;
    let y = el.getAttribute('position').y;
    let z = el.getAttribute('position').z;
    el.setAttribute('position', {
        x: x,
        y: y - .1,
        z: z
    });
}

document.onkeydown = function(event) {
    let el = document.getElementById('moveable');
    let x = el.getAttribute('position').x;
    let y = el.getAttribute('position').y;
    let z = el.getAttribute('position').z;
    switch (event.keyCode) {
        case 37:
            el.setAttribute('position', {
                x: x - .1,
                y: y,
                z: z
            });
            break;
        case 38:
            el.setAttribute('position', {
                x: x,
                y: y + .1,
                z: z
            });
            break;
        case 39:
            el.setAttribute('position', {
                x: x + .1,
                y: y,
                z: z
            });
            break;
        case 40:
            el.setAttribute('position', {
                x: x,
                y: y - .1,
                z: z
            });
            break;
    }
};

function narrativeCategory() {
    console.log(document.getElementById("car").value);
}
