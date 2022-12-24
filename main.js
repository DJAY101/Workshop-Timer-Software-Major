import './style.css'

import * as THREE from 'three'  //Import the 3D graphic library
import { AlphaFormat, RGBAFormat } from 'three';

import {clockCube} from './cube.js';

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
camera.position.setZ(30);




const pointLight = new THREE.PointLight(0xffffff);
const light = new THREE.AmbientLight(0xffffff);
light.position.set(15, 15, 100);
light.intensity = 0.5;
pointLight.position.set(0,15, 30);
pointLight.intensity = 1.5;

const cubeSizes= 9;

const cubeSeconds2 = new clockCube(scene, cubeSizes, 10, 0, 1, 0.002);
const cubeSeconds1 = new clockCube(scene, cubeSizes, 25, 0, 1, 0.005);

const cubeHours1 = new clockCube(scene, cubeSizes, -25, 0, 1, 0.001);
const cubeHours2 = new clockCube(scene, cubeSizes, -10, 0, 1, 0.001);



scene.add(pointLight);
scene.add(light);
//scene.add(cube);

function animate() {

  requestAnimationFrame( animate );

  var dt = new Date();
  var seconds1 = 0;
  var seconds2 = 0;
  var hours1 = 0;
  var hours2 = 0;

  if (String(dt.getSeconds()).length == 1) {
    seconds1 = 0;
    seconds2 = dt.getSeconds();
  } else {
    seconds1 = parseInt(String(dt.getSeconds()).split("")[0]);
    seconds2 = parseInt(String(dt.getSeconds()).split("")[1]);
  }

  if(String(dt.getHours()).length == 1) {
    hours1 = 0;
    hours2 = dt.getHours();
  } else {
    hours1 = parseInt(String(dt.getHours()).split("")[0]);
    hours2 = parseInt(String(dt.getHours()).split("")[1]);

  }


  cubeSeconds2.update(seconds1);
  cubeSeconds1.update(seconds2);

  cubeHours1.update(hours1);
  cubeHours2.update(hours2);


  renderer.render(scene, camera);

}

animate();

addEventListener("resize", (event) => {});

onresize = (event) => {

  canvasH = canvas.clientHeight;
  canvasW = canvas.clientWidth;

  document.getElementById('bg').style.height = String(canvasH)+"px";
  document.getElementById('bg').style.width = String(canvasW)+"px";


  console.log(canvasW);

  //re-adjust window size
  renderer.setSize( canvasW, canvasH, false );
  camera.aspect = canvasW / canvasH;
  camera.updateProjectionMatrix();

};