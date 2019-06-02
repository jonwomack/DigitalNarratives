
    const starBucks = new AR(33.776527, -84.388348, 10, "Starbucks");

    const westVillage = new AR(33.779457, -84.404843, 10, "West Village", 'black');
    const wingZone = new AR(33.779494, -84.405612, 294, "Wing Zone", 'black');
    const fitten = new AR(33.778210, -84.403753, 10, "Fitten", 'black');
    const folk = new AR(33.778907, -84.404858, 10, "Folk", 'black');
    const caldwell = new AR(33.778897, -84.404419, 10, "Caldwell", 'black');
    const fulmer = new AR(33.778625, -84.403892, 10, "Fulmer", 'black');
    const westVillageDiningCommons = new AR(33.779146, -84.404474, 10, "WVDC", 'black');
    const eighth = new AR(33.779803, -84.403961, 10, "Due North", 'black');
    const coor = new AR(33.779125, -84.403064, 10, "East Point", 'black');
    const einstein = new AR(33.775203, -84.397774, 10,  "einstein", 'black');


        //GTRI
    const ym = new AR(33.776998,-84.389803, 292, "Yogli Mogli", 'blue');
    const ncr = new AR(33.779051, -84.389330, 292, "NCR Global" );
    const waffleHouse = new AR(33.776607,-84.389426, 292, "Waffle House");




const el = document.getElementById("moving");

<a-entity gltf-model="#einstein" position="0 1.6 -10" rotation="0 -90 0" scale="1 1 2"></a-entity>
<a-asset-item id="einstein" src="Einstein.glb"></a-asset-item>




<p>Dr.Freeman Objects</p>
< button
onClick = "placeObjects(freeman)" > Place < /button>

<button onClick="moveObject()">Move</button>


//Moving Object
function moveObject() {
    setInterval(moveObjectH, 20);
}
function moveObjectH() {
    let x = currX + 100*Math.cos(time);
    let y = currAlt;
    let z = currZ + 100*Math.sin(time);
    el.object3D.position.set(x, y, z);
    time += (5*Math.PI)/360;
}


    //const einstein2 = new AR(33.77509, -84.39786, 283, "Actual Ein", 'white', true, 'Einstein.glb');
    //const einstein = new AR(33.774577, -84.397340, 295 , "ein", 'white', true, 'Einstein.glb');


//Dr.Freeman Objects
const north = new AR(33.953149972982295, -84.6382802709262, 304, "North", 'red');
const south = new AR(33.95212652307029, -84.63830172859832, 304, "South", 'blue');
const east = new AR(33.95263379978259, -84.6376687272708, 304, "East", 'yellow');
const west = new AR(33.952656048692, -84.63894009434387, 304, "West", 'purple');
const given = new AR(33.95262935, -84.63824272, 304, "Given", 'white');

//Florida House
const north = new AR(27.656908, -80.389372, 1, "north", 'red');
const south = new AR(27.654716, -80.389366, 1, "south", 'blue');
const east = new AR(27.655869, -80.388180, 1, "east", 'yellow');
const west = new AR(27.655852, -80.390410, 1, "wezt", 'purple');
const house = new AR(27.6555439, -80.3894948, 1, "given", 'white');


    const n = new AR(33.775197, -84.397288, 286, "North", 'red', false, "");
    const s = new AR(33.774012, -84.397322, 286, "South", 'blue', false, "");
    const e = new AR(33.774618, -84.396867, 286, "East", 'yellow', false, "");
    const w = new AR(33.774615, -84.397792, 286, "West", 'purple', false, "");
    const g = new AR(33.774577, -84.397340, 286, "Center", 'white', false, "");
    const tl = new AR(33.775202, -84.397764, 283, "Top Left", 'black', false, "");
    const tr = new AR(33.775192, -84.396863, 283, "Top Right", 'black', false, "");
    const bl = new AR(33.774025, -84.397806, 283, "Bottom Left", 'black', false, "");
    const br = new AR(33.774002, -84.396867, 283, "Bottom Right", 'black', false, "");

//FIREBASE CODE

    const ryan = new AR(30.435449, -84.308163, 27,"Center",'blue');