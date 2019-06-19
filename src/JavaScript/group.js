const username = localStorage.getItem("username");
const password = localStorage.getItem("password");

//Creating AR object above user
function addUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(addUserLocationH);
    } else {
        demo.innerHTML = "Geolocation is not supported by this browser.";
    }
}
function addUserLocationH(position) {
    currLat = position.coords.latitude;
    currLon = position.coords.longitude;
    currAlt = 0//position.coords.altitude;
    if (currLat == null || currLon == null || currAlt == null) {
        currLat = 0;
        currLon = 0;
        currAlt = 0;
    } else {
        if (bool) {
            let user = firebase.database().ref(`/users/${username}`);
            user.update({
                location: true
            });

            writeObjectDataSphere(username, currLat, currLon, currAlt, username, true, false, 'black');
        } else {
            let user = firebase.database().ref(`/users/${username}`);
            user.update({
                location: true
            });
            writeObjectDataSphere(username, currLat, currLon, currAlt, username, false, false, 'black');
        }
    }
}

//Checks to see if AR object alread exists
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

//Creates AR Object
async function writeObjectData(isPublic) {
    let x = document.getElementById("form2");
    let input = document.getElementById("avatar");
    let name = x.elements[0].value;
    let lat = x.elements[1].value;
    let lon = x.elements[2].value;
    let alt = x.elements[3].value;
    let txt = x.elements[4].value;
    let exists = await objExists(name);
    if (!exists) {
        writeObjectDataTxt(name, lat, lon, alt, username, isPublic, txt);
        setTimeout(function (){window.location.reload(true);}, 3000);
    } else {
        alert("Object Already Exists");
    }
}
//A-frame sphere created
function writeObjectDataTxt(name, latitude, longitude, altitude, username, pub, txt) {
    firebase.database().ref('/objects/' + name).set({
        longitude: longitude,
        latitude: latitude,
        altitude: altitude,
        username: username,
        public: pub,
        type: 'txt',
        text: txt
    });
}
//Creating a Group
function createGroup() {
    let x = document.getElementById("form1");
    let groupname = x.elements[0].value;
    let path = `/groups/${groupname}/`;
    let groups = firebase.database().ref('/groups/');
    let exists = false;
    groups.once('value').then(function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            let groupsDB = childSnapshot.key;
            if (groupsDB === groupname) {
                exists = true;
            }
        });
        if (!exists) {
            firebase.database().ref(path).set({
                groupsize: 1
            });
            let newMemberRef = firebase.database().ref(path + 'members/');
            newMemberRef.update({
                [username]: 0
            });
        } else {
            demo.innerHTML = "Group Already Exists";
        }
    });
}
//Go to Previous page
function goBack() {
    location.assign('/arworld');
}






//Adding a user to a group
async function inGroup(groupsize, userToAdd, pathToGroup, groupname) {
    let result = await inGroupH(groupsize, userToAdd, pathToGroup, groupname);
    return result;
}
async function inGroupH(groupsize, userToAdd, pathToGroup, groupname) {
    let promise = new Promise(resolve => {
        let member = false;
        let usersInGroup = firebase.database().ref(`/groups/${groupname}/members/`);
        usersInGroup.once('value').then(function (snapshot) {
            snapshot.forEach(function (childSnapshot){
                let userInGroup = childSnapshot.key;
                if (userToAdd === userInGroup) {
                    console.log("useringroup");
                    member = true;
                }
            });
        });
        setTimeout(() => resolve(member), 500);
    });
    let value = await promise;
    return value;
}
async function userExists(userToAdd) {
    let result = await userExistsH(userToAdd);
    return result;
}
async function userExistsH(userToAdd) {
    let promise = new Promise(resolve => {
        let exists = false;
        let users = firebase.database().ref('/users/');
        users.once('value').then(function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                let usernameDB = childSnapshot.key;
                if (usernameDB === userToAdd) {
                    exists = true;
                    console.log("userexists");
                }
            });
        });
        setTimeout(() => resolve(exists), 500);
    });
    let value = await promise;
    return value;
}

async function groupExists(groupname) {
    let result = await groupExistsH(groupname);
    return result;
    // expected output: 'resolved'
    /*result = await callback(groupname);
    console.log(result);
    return result;
    */
}
async function groupExistsH(groupname) {
    let promise = new Promise(resolve => {
        let exists = false;
        let groups = firebase.database().ref('/groups/');
        groups.once('value').then(function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                let groupnameDB = childSnapshot.key;
                if (groupnameDB === groupname) {
                    exists = true;
                    console.log("group exists");
                }
            });
        });
        setTimeout(() => resolve(exists), 500); // resolve
    });

    // wait for the promise to resolve
    let value = await promise;
    return value;
}


async function addUserToGroup() {
    var x = document.getElementById("form1");
    let groupname = x.elements[0].value;
    let userToAdd = x.elements[2].value;
    let pathToGroup = `/groups/${groupname}/`;
    let groupsize = 0;
    let result = await groupExists(groupname, groupExistsH());
    let result2 = await userExists(userToAdd);
    firebase.database().ref(pathToGroup + '/groupsize/').once('value').then(function (snapshot) {
        groupsize = snapshot.val();
    });
    let result3 = await inGroup(groupsize, userToAdd, pathToGroup, groupname);

    if (!result3) {
        if (result2) {
            if (result) {
                console.log("accessed");
                firebase.database().ref(pathToGroup).update({
                    groupsize: groupsize + 1
                });
                let newMemberRef = firebase.database().ref(pathToGroup + 'members/');
                newMemberRef.update({
                    [userToAdd]: groupsize
                });
            }
        }
    }
}


function displayObjects() {
    let objList = document.getElementById('objectList');
    let list = document.createElement('list');
    list.setAttribute("id", "list");
    firebase.database().ref('/objects/').once('value').then(function (snapshot) {
        snapshot.forEach( function(childSnapshot) {
                if(childSnapshot.child('username').val() === username) {
                    let cs = childSnapshot.key.toString();
                    if (childSnapshot.child('type').val() === 'glb' || childSnapshot.child('type').val() === 'txt') {
                        let fileName = childSnapshot.child('fileName').val();
                        list.innerHTML += `<li id='${childSnapshot.key}Item'>${childSnapshot.key} <button onclick='deleteObjectGlb("${cs}", "${fileName}")'>Delete</button></li>`;
                    } else {
                        list.innerHTML += `<li id='${childSnapshot.key}Item'>${childSnapshot.key} <button onclick='deleteObject("${cs}")'>Delete</button></li>`;
                    }

                }
            }
        );
    });
    objList.appendChild(list);
}
function deleteObject(object) {
    document.getElementById("list").removeChild(document.getElementById(`${object}Item`));
    firebase.database().ref(`/objects/${object}`).once('value').then(function (snapshot) {
            firebase.database().ref(`/objects/${object}`).remove();
    })
}
function deleteObjectGlb(object, fileName) {
    document.getElementById("list").removeChild(document.getElementById(`${object}Item`));
    firebase.database().ref(`/objects/${object}`).once('value').then(function (snapshot) {
        firebase.database().ref(`/objects/${object}`).remove();
    });
    firebase.storage().ref(`/glb/${username}/${object}/${fileName}/`).delete();
}
