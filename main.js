import './style.css'

import * as THREE from 'three'  //Import the 3D graphic library
import { AlphaFormat, RGBAFormat } from 'three';

import {clockCube} from './cube.js';
import {ClockLoader} from './ClockLoader';

// create a new scene background of nothing
const scene = new THREE.Scene();
scene.background = null;

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
light.intensity = 0.5;
pointLight.position.set(0,15, 30);
pointLight.intensity = 1.5;

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






function updateCubes(canvas_W) {

  clockLoader.SetXPos(-canvasW*0.055/2);
  clockLoader.RefreshCubes(canvasW);


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


