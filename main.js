import './style.css'

import * as THREE from 'three'  //Import the 3D graphic library
import { AlphaFormat, RGBAFormat } from 'three';


import {clockCube} from './cube.js';
import {ClockLoader} from './ClockLoader';
import {countdown} from './countdown';


const alarm = new Audio("Alarm.mp3");

// create a new scene background of nothing
const scene = new THREE.Scene();

// load a texture, set wrap mode to repeat
const textureBackground = new THREE.TextureLoader().load( "Background.jpg" );
textureBackground.wrapS = THREE.RepeatWrapping;
textureBackground.wrapT = THREE.RepeatWrapping;

scene.background = textureBackground;

//set the canvas and canvas size variables
var canvas = document.getElementById('renderBox');
var canvasH = canvas.scrollHeight;
var canvasW = canvas.scrollWidth;

// create a camera object
const camera = new THREE.PerspectiveCamera(90, canvasW / canvasH, 0.1, 1000)

//init the rendering engine
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  alpha: true
  
});

//setup the rendering engine
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( canvasW, canvasH );

//set the camera position
camera.position.setZ(40);




const pointLight = new THREE.PointLight(0xffffff);
const light = new THREE.AmbientLight(0xffffff);
light.position.set(15, 15, 100);
light.intensity = 1.2;
pointLight.position.set(0,15, 40);
pointLight.intensity = 1;

var clockLoader = new ClockLoader(scene, -canvasW*0.055/2, 0, 0, 0.009);
clockLoader.RefreshCubes(canvas.clientWidth);

scene.add(pointLight);
scene.add(light);
//scene.add(cube);

function animate() {

  requestAnimationFrame( animate );
  clockLoader.UpdateCubes();

  renderer.render(scene, camera);

}

animate();





document.getElementById("startButton").addEventListener("click", startClicked)


function updateCubes(canvas_W) {

  clockLoader.SetXPos(-canvasW*0.055/2);
  clockLoader.RefreshCubes(canvasW);

}

var Countdown;

function startClicked() {

  if(document.getElementById("CSVPath").files[0]) {
    document.getElementById("startDiv").style.display = "none";
  }

  Countdown = new countdown(document.getElementById("CSVPath").files[0], document);
  Countdown.loadData();


}




addEventListener("resize", (event) => {});

onresize = (event) => {


  canvasH = canvas.clientHeight;
  canvasW = canvas.clientWidth;

  document.getElementById('bg').style.height = String(canvasH)+"px";
  document.getElementById('bg').style.width = String(canvasW)+"px";

  updateCubes(canvasW);

  console.log(canvasW);

  //re-adjust window size
  renderer.setSize( canvasW, canvasH, false );
  camera.aspect = canvasW / canvasH;
  camera.updateProjectionMatrix();

};




