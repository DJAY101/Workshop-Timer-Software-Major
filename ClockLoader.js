import {clockCube} from './cube.js';

export class ClockLoader {


    constructor(scene, x_pos, y_pos, z_pos, spacing) {

        this.clockCubes = [];

        this.spacing = spacing;
        this.scene = scene;

        this.x_pos = x_pos;
        this.y_pos = y_pos;
        this.z_pos = z_pos;


    }

    SetXPos(x_pos) {
        this.x_pos = x_pos;
    }

    PurgeCubes() {
        for (var i = 0; i < 6; i++) {
            this.clockCubes[i].delete();
        }
        this.clockCubes = [];
    }

    RefreshCubes(canvasWidth) {

        if(this.clockCubes.length != 0) {this.PurgeCubes();}
        var cubeSize = canvasWidth/120;
        for(var i = 0; i < 6; i++) {
            var temp = new clockCube(this.scene, cubeSize, this.x_pos+i*this.spacing*canvasWidth, this.y_pos, this.z_pos, 0.001+0.001*i);
            this.clockCubes.push(temp);
        }


    }

    UpdateCubes() {
        const dt = new Date();

        // Timedata is an array formatted following [h, h, m, m, s, s]
        var TimeData = [(String(dt.getHours()).length == 1) ? '0' : String(dt.getHours())[0], (String(dt.getHours()).length == 1) ? String(dt.getHours()) : String(dt.getHours())[1], (String(dt.getMinutes()).length == 1) ? '0' : String(dt.getMinutes())[0], (String(dt.getMinutes()).length == 1) ? String(dt.getMinutes()) : String(dt.getMinutes())[1], (String(dt.getSeconds()).length == 1) ? '0' : String(dt.getSeconds())[0], (String(dt.getSeconds()).length == 1) ? String(dt.getSeconds()) : String(dt.getSeconds())[1] ]
        

        for(var i = 0; i < 6; i++){
           this.clockCubes[i].update(TimeData[i]);
        }

    }



}