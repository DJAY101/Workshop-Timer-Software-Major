import './style.css'

import * as THREE from 'three'  //Import the 3D graphic library
import { AlphaFormat, RGBAFormat } from 'three';

import {ClockLoader} from './ClockLoader';
import {countdown} from './countdown';


//set the canvas and canvas size variables
var canvas = document.getElementById('renderBox');
var canvasH = canvas.scrollHeight;
var canvasW = canvas.scrollWidth;


// create a new scene background of nothing
const scene = new THREE.Scene();

function loadBackground(){
// load a texture, set wrap mode to repeat
const textureBackground = new THREE.TextureLoader().load( "Background.jpg" );
textureBackground.minFilter = THREE.LinearFilter;
textureBackground.wrapS = THREE.RepeatWrapping;
textureBackground.wrapT = THREE.RepeatWrapping;

var aspect = window.width/window.height;

var image = 5472/3648;
var imagex = 2932;
var imagey = 2932;

var enlargeFactor = 5;
textureBackground.offset.x = enlargeFactor*(1/(imagex/canvas.clientWidth))/2;
textureBackground.offset.y = enlargeFactor*(1/(imagey/canvas.clientHeight));


textureBackground.repeat.x = enlargeFactor*(1/(imagex/canvas.clientWidth));
textureBackground.repeat.y = enlargeFactor*(1/(imagey/canvas.clientHeight));

scene.background = textureBackground;
}
loadBackground();

// create a camera object
const camera = new THREE.PerspectiveCamera(10, canvasW / canvasH, 0.1, 1000)

//init the rendering engine
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  alpha: true
  
});

//setup the rendering engine
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( canvasW, canvasH );

//set the camera position
camera.position.setZ(400);




const pointLight = new THREE.PointLight(0x5951EB);
const light = new THREE.AmbientLight(0xffffff);
light.position.set(15, 15, 100);
light.intensity = 1.2;
pointLight.position.set(0,15, 40);
pointLight.intensity = 1;


//create the clock loader class that is in charge of spawning in the clock cubes
var clockLoader = new ClockLoader(scene, -canvasW*0.059/2, 5, 0, 0.008);
clockLoader.RefreshCubes(canvas.clientWidth);

scene.add(pointLight);
scene.add(light);
//scene.add(cube);


var Countdown; //create the countdown class in charge of displaying time remaining for the workshop time, alarm and upcoming classes




//function that gets called over and over, the main loop function
function animate() {

  if (Countdown) Countdown.Update();

  requestAnimationFrame( animate );
  clockLoader.UpdateCubes();

  renderer.render(scene, camera);

}
animate();




function loadNewQuote() {


  //load the quote json file and select a random quote to show at front end
  fetch("./quotes.json").then(data => {
    data.json().then(jsonFile=>{
      let quoteData = jsonFile[Math.trunc(Math.random()*(jsonFile.length-1))];
      document.getElementById("quote").innerHTML = '"' + quoteData["text"] + '" ' + (quoteData["author"] ? quoteData["author"] : "")

    })
  })

}
// set up interval loop to display a new quote every given interval
let quoteIntervalsMinutes = 30;
loadNewQuote();
window.setInterval(loadNewQuote, quoteIntervalsMinutes*60*1000)




//set an event listener to check when the start button has been clicked and if so run a function
document.getElementById("startButton").addEventListener("click", startClicked)


//the function that is called when the start button on the home page is clicked
function startClicked() {

  // If a path is selected then hide the home page elements
  if(document.getElementById("CSVPath").files[0]) {
    document.getElementById("startDiv").style.display = "none";
  }

  //within the countdown class pass in the selected CSV file and load the data into the class
  Countdown = new countdown(document.getElementById("CSVPath").files[0], document);
  Countdown.loadData();


}


//update cube positions when the canvas size has been changed
function updateCubes(canvas_W) {

  clockLoader.SetXPos(-canvasW*0.059/2);
  clockLoader.RefreshCubes(canvasW);

}


// create a event listener that calls a function whenever the window is resized
addEventListener("resize", (event) => {});


//when the window is being resized re adjust cube size and render aspects
onresize = (event) => {

  
  canvasH = canvas.clientHeight;
  canvasW = canvas.clientWidth;


  loadBackground();
  //readjust canvas size
  document.getElementById('bg').style.height = String(canvasH)+"px";
  document.getElementById('bg').style.width = String(canvasW)+"px";

  //update cube sizes with the new canvas width
  updateCubes(canvasW);

  //re-adjust window size
  renderer.setSize( canvasW, canvasH, false );
  camera.aspect = canvasW / canvasH;
  camera.updateProjectionMatrix();

};




