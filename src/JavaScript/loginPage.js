function createUser() {
    var x = document.getElementById("form1");
    let username = x.elements[0].value;
    let password = x.elements[1].value;
    let exists = false;
    let users = firebase.database().ref('/users/');
    users.once('value').then(function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            let usernameDB = childSnapshot.key;
            let temp = `${childSnapshot.key}/password`;
            let passwordDB = snapshot.child(temp).val();
            if (usernameDB === username) {
                exists = true;
            }
        });
        if (!exists) {
            demo.innerHTML = "User Created";
            firebase.database().ref('users/' + username).set({
                password: password,
                groups: "groups"
            });
        } else {
            demo.innerHTML = "User Already Exists";
        }
    });
}

function loginUser() {
    var x = document.getElementById("form1");
    let username = x.elements[0].value;
    let password = x.elements[1].value;
    let loggedin = false;
    let users = firebase.database().ref('/users/');
    users.once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            let usernameDB = childSnapshot.key;
            let temp =`${childSnapshot.key}/password`;
            let passwordDB = snapshot.child(temp).val();
            if (usernameDB === username && passwordDB === password) {
                loggedin = true;
                localStorage.setItem("username", usernameDB);
                localStorage.setItem("password", passwordDB);
                document.getElementById("engage").disabled = false;
                document.getElementById("create").disabled = false;
            }
        });
        if (!loggedin) {
            alert("Incorrect username or password.")
        }
    });
}

function toEngage() {
    location.assign('../engage');
}
function toCreate() {
    location.assign('../create');
}

