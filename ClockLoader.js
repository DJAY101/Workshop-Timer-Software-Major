import {clockCube} from './cube.js';
import * as THREE from 'three'  //Import the 3D graphic library
import { randFloat } from 'three/src/math/MathUtils.js';


export class ClockLoader {


    constructor(scene, x_pos, y_pos, z_pos, spacing) {

        this.clockCubes = [];
        this.dynamicCubes = [];

        this.spacing = spacing;
        this.scene = scene;

        //origin is set at far left and vertical center
        this.x_pos = x_pos;
        this.y_pos = y_pos;
        this.z_pos = z_pos;

        this.material = new THREE.MeshStandardMaterial( {color : '#f78d4a', metalness: 0.2} );



    }

    SetXPos(x_pos) {
        this.x_pos = x_pos;
    }

    PurgeCubes() {
        for (var i = 0; i < 6; i++) {
            this.clockCubes[i].delete();
        }

        for(var i = 0; i < 4 ; i++) {
            this.scene.remove(this.dynamicCubes[i]);
        }

        this.dynamicCubes = [];
        this.clockCubes = [];
    }

    RefreshCubes(canvasWidth) {

        if(this.clockCubes.length != 0) {this.PurgeCubes();}
        var cubeSize = canvasWidth/150;
        var spaceOffset = 0;

        this.geometry = new THREE.BoxGeometry(cubeSize/3.5, cubeSize/3.5, cubeSize/3.5);


        for(var i = 0; i < 6; i++) {
            // Add space offset for the space seperating hh mm ss and spawn in dynamic cubes
            if (i%2 == 0 && i != 0) {
                var spaceIncrement = 0.005*canvasWidth;
                spaceOffset += spaceIncrement;

                var dynamicSpawnX = this.x_pos+i*this.spacing*canvasWidth + spaceOffset-spaceIncrement-cubeSize/4;

                var cube = new THREE.Mesh(this.geometry, this.material);
                var cube2 = new THREE.Mesh(this.geometry, this.material);

                var dynamicYOffset = canvasWidth*0.002

                cube.position.set(dynamicSpawnX, this.y_pos + dynamicYOffset, this.z_pos);
                cube2.position.set(dynamicSpawnX, this.y_pos - dynamicYOffset, this.z_pos);

                this.scene.add(cube);
                this.scene.add(cube2);

                this.dynamicCubes.push(cube);           
                this.dynamicCubes.push(cube2);           
            }

            
            var xSpawnCoord = this.x_pos+i*this.spacing*canvasWidth + spaceOffset

            

            var temp = new clockCube(this.scene, cubeSize, xSpawnCoord, this.y_pos, this.z_pos, 0.001+0.001*i);
            this.clockCubes.push(temp);
        }


    }

    UpdateCubes() {
        const dt = new Date();

        // Timedata is an array formatted following [h, h, m, m, s, s]
        var TimeData = [(String(dt.getHours()).length == 1) ? '0' : String(dt.getHours())[0], (String(dt.getHours()).length == 1) ? String(dt.getHours()) : String(dt.getHours())[1], (String(dt.getMinutes()).length == 1) ? '0' : String(dt.getMinutes())[0], (String(dt.getMinutes()).length == 1) ? String(dt.getMinutes()) : String(dt.getMinutes())[1], (String(dt.getSeconds()).length == 1) ? '0' : String(dt.getSeconds())[0], (String(dt.getSeconds()).length == 1) ? String(dt.getSeconds()) : String(dt.getSeconds())[1] ]
        
        for (var i = 0; i < 4; i++) {
            this.dynamicCubes[i].rotation.x += Math.random()* 0.02;
            this.dynamicCubes[i].rotation.y += Math.random()* 0.02;
            this.dynamicCubes[i].rotation.z += Math.random()* 0.02;
        }

        for(var i = 0; i < 6; i++){
           this.clockCubes[i].update(TimeData[i]);
        }

    }



}