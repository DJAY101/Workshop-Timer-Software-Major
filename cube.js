import * as THREE from 'three' 
export class clockCube {

    constructor(scene, size, x_pos, y_pos, z_pos) {
        this.scene = scene;
        this.size = size;
        this.x_pos = x_pos;
        this.y_pos = y_pos;
        this.z_pos = z_pos;

        this.targetRotX = 0;
        this.targetRotY = 0;
        this.targetRotZ = 0;

        this.targetLookAt = new THREE.Vector3(1, 0, 0);

        this.idleRotXDir = 1;
        this.idleRotYDir = 1;
        this.idleRotZDir = 1;

        this.idleRotOffset = Math.PI/9;

        this.geometry = new THREE.BoxGeometry(size, size, size);
        this.material = new THREE.MeshStandardMaterial( {color : '#034afc'} );

        this.cube = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.cube);

        this.cube.position.set(x_pos, y_pos, z_pos)

        this.oldTime = Date.now();

        this.idleSpeed = 0.0005;

    }


    update() {

        this.DeltaTime = Date.now() - this.oldTime;

        //console.log(Math.abs(this.targetRotX+(this.idleRotXDir*this.idleRotOffset) - this.cube.rotation.x));



        // if (Math.abs(this.targetRotX+(this.idleRotXDir*this.idleRotOffset) - this.cube.rotation.x) <= 0.01) {
        //     this.idleRotXDir *= -1;
        // }
        if (Math.abs(5*(this.idleRotYDir) - this.targetLookAt.y) <= 0.01) {
            this.idleRotYDir *= -1;
        }
        // if (Math.abs(this.targetRotZ+(this.idleRotZDir*this.idleRotOffset) - this.cube.rotation.z) <= 0.01) {
        //     this.idleRotZDir *= -1;
        // }
        this.targetLookAt.y += 0.01*this.idleRotYDir;
        this.cube.lookAt(this.targetLookAt);

        // this.cube.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), this.idleSpeed*this.idleRotXDir*this.DeltaTime);
        // this.cube.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), this.idleSpeed*this.idleRotYDir*this.DeltaTime);
        // this.cube.rotateZ(this.idleSpeed*this.idleRotZDir*this.DeltaTime);

        this.oldTime = Date.now();
    }


}