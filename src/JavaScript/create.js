var file;
//Testing

function insertObject(fileType) {
    let input;
    let objectURL;
    if (fileType === 'glb') {
        input = document.getElementById("insert");
        file = input.files[0];
        objectURL = URL.createObjectURL(file);
        console.log(objectURL);
        insertObjectGlb(objectURL);
    } else if (fileType === 'png') {
        input = document.getElementById("insert2");
        file = input.files[0];
        objectURL = URL.createObjectURL(file);
        console.log(objectURL);
        insertObjectPng(objectURL);
    }
}
function insertObjectGlb(objectURL) {
    let el = document.createElement('a-entity');
    el.setAttribute('gltf-model', objectURL);
    el.setAttribute('id', 'moveable');
    //el.object3D.scale.set(.1, .1, .1);
    el.setAttribute('position', {
        x: currX,
        y: currAlt,
        z: currZ
    });
    el.className += "glb";
    let sceneEl = document.querySelector('a-scene');
    sceneEl.appendChild(el);
    disableInsertButtons();
}
function insertObjectPng(objectURL) {
    let el = document.createElement('a-entity');
    let asset = document.getElementById('assets');
    asset.innerHTML = `<img id="image" src="${objectURL}">`;
    el.setAttribute('geometry', {
        primitive: 'plane',
    });
    el.setAttribute('material', {
        side: 'double',
        shader: 'flat',
        src: `#image`
    });
    el.setAttribute('id', 'moveable');
    //el.object3D.scale.set(.1, .1, .1);
    el.setAttribute('position', {
        x: currX,
        y: currAlt,
        z: currZ
    });
    el.className += "png";
    let sceneEl = document.querySelector('a-scene');
    sceneEl.appendChild(el);
    disableInsertButtons();
}
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

        if (el.className === 'png') {
            console.log("Creating PNG");
            writeObjectDataPng(objName, lat, lon, y, username, true, file.name);
            createFile(file, objName);
        } else if (el.className === 'txt') {
            console.log("Creating TXT");
            for (let i = 0; i < objTopics.length; i++) {
                console.log(objTopics[i]);
            }
            writeObjectDataTxt(objName, lat, lon, y, username, true, document.getElementById('insert3').value, objTopics);
        } else if (el.className === 'glb') {
            console.log("Creating GLB");
            writeObjectDataGlb(objName, lat, lon, y, username, true, file.name);
            createFile(file, objName);
        }
        //createFile(file, objName);
        //writeObjectDataGlb(objName, currLat, currLon, currAlt, username, true, file.name)
    } else {
        alert("Object Exists: Change Name");
    }

}

function createFile(file, objName) {
    if (file != null) {
        firebase.storage().ref(`glb/${username}/${objName}/${file.name}`).put(file).then(function (snapshot) {
            console.log('Uploaded a blob or file!');
        });
        demo.innerHTML = "File Uploaded";
    } else {
        demo.innerHTML = "No File";
    }
}
function writeObjectDataGlb(name, latitude, longitude, altitude, username, pub, fileName) {
    firebase.database().ref('/objects/' + name).set({
        longitude: longitude,
        latitude: latitude,
        altitude: altitude,
        username: username,
        public: pub,
        type: 'glb',
        fileName: fileName
    });
}

function writeObjectDataPng(name, latitude, longitude, altitude, username, pub, fileName) {
    firebase.database().ref('/objects/' + name).set({
        longitude: longitude,
        latitude: latitude,
        altitude: altitude,
        username: username,
        public: pub,
        type: 'png',
        fileName: fileName
    });
}
function writeObjectDataTxt(name, latitude, longitude, altitude, username, pub, fileName, topics) {
    firebase.database().ref('/objects/' + name).set({
        longitude: longitude,
        latitude: latitude,
        altitude: altitude,
        username: username,
        public: pub,
        type: 'txt',
        fileName: fileName,
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
