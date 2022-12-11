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
const camera = new THREE.PerspectiveCamera(80, canvasW / canvasH, 0.1, 1000)

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

var cubes = [];



const geometry = new THREE.BoxGeometry(6, 6, 6);
const material = new THREE.MeshStandardMaterial( {color : '#034afc'} );
// const cube = new THREE.Mesh(geometry, material);

for (let i = 0; i < 1; i++) {
  var cube = new THREE.Mesh(geometry, material);
  cube.position.set(i*0, 0, 0);
  cubes.push(cube);
  scene.add(cube);
}

const pointLight = new THREE.PointLight(0xffffff);
const light = new THREE.AmbientLight(0xffffff);
light.position.set(15, 15, 100);
light.intensity = 0.5;
pointLight.position.set(0,15, 30);
pointLight.intensity = 2;


const cube1 = new clockCube(scene, 10, 0, 5, 1);

scene.add(pointLight);
scene.add(light);
//scene.add(cube);

function animate() {

  requestAnimationFrame( animate );

  cube1.update();

  for(var cube of cubes) {
  cube.rotation.x += Math.random()* 0.02;
  cube.rotation.y += Math.random()* 0.02;
  cube.rotation.z += Math.random()* 0.02;
  }

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

  for(var cube of cubes) {
    scene.remove(cube);
  }
  cubes = [];

  for (let i = 0; i < 4; i++) {
    var cube = new THREE.Mesh(geometry, material);
    cube.position.set(i*18-25, 0, 0);
    cubes.push(cube);
    scene.add(cube);
  }

};