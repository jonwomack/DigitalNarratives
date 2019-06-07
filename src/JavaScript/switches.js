var isGlb = false;
var myVar4;
var myVar5;
(function() {
    $(document).ready(function() {
        $('.switch-input3').on('change', function() {
            var isChecked = $(this).is(':checked');
            if (isChecked) {
                clearInterval();
                isGlb = true;
                removeColor();
                myVar4 = setInterval(addUserLocation, 1000);
            } else {
                clearInterval();
                isGlb = false;
                addColor();
                myVar5 = setInterval(addUserLocation, 1000);
            }
        });
    });
})();



var isPublic = false;
var myVar3;
var myVar4;
(function() {
    $(document).ready(function() {
        $('.switch-input2').on('change', function() {
            var isChecked = $(this).is(':checked');
            if (isChecked) {
                clearInterval();
                isPublic = true;
                myVar3 = setInterval(addUserLocation, 1000);
            } else {
                clearInterval();
                isPublic = false;
                myVar4 = setInterval(addUserLocation, 1000);
            }
        });
    });
})();




var bool = false;
var myVar;
var myVar2;
(function() {
    $(document).ready(function() {
        $('.switch-input').on('change', function() {
            var isChecked = $(this).is(':checked');
            if (isChecked) {
                clearInterval();
                bool = true;
                myVar = setInterval(addUserLocation, 1000);
            } else {
                clearInterval();
                bool = false;
                myVar2 = setInterval(addUserLocation, 1000);
            }
        });
    });

})();




function removeColor() {
    removeHtml(document.getElementById("demo2"), document.getElementById("colorTxt"));
    appendHtml(document.getElementById("av"), `<input id="avatar" type="file"  name="avatar" accept=".glb">`);
    appendHtml(document.getElementById("demo3"), `<label id="color2" for="avatar">Choose a glb file</label>`);
}
function addColor() {
    removeHtml(document.getElementById("demo3"), document.getElementById("color2"));
    removeHtml(document.getElementById("av"), document.getElementById("avatar"));

    const parent = document.getElementById("demo2");
    appendHtml(parent, '<p id="colorTxt">Color: <input type="text" name="color" value="black"></p>');

}
function removeHtml(el, child ) {
    el.removeChild(child);
}

function appendHtml(el, str) {
    var div = document.createElement('div');
    div.innerHTML = str;
    while (div.children.length > 0) {
        el.appendChild(div.children[0]);
    }
}