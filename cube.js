import * as THREE from 'three' 
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
export class clockCube {


    updateText(scene, newText)
    {
        if (globalThis.currentText == newText) {return}
        globalThis.currentText = newText

        //console.log("doing magic");

        var textGeo = null;
        var textGeo2 = null;
        var text = null;
        var text2 = null;
        var textMat = new THREE.MeshStandardMaterial( {color : '#FFAC1C'} );
        
        
        const size = this.size;
        const y_pos = this.y_pos;
        
        scene.remove(globalThis.text);
        scene.remove(globalThis.text2);
        
        const loader = new FontLoader();

        loader.load( '/fonts/Number.json', function ( font ) {

            textGeo = new TextGeometry( newText, {
                font: font,
                size: 4,
                height: 1,
                
            } );
            text = new THREE.Mesh(textGeo, textMat);

            //center geometry
            var center = new THREE.Vector3();
            text.geometry.computeBoundingBox();
            text.geometry.boundingBox.getCenter(center);
            text.geometry.center();
            text.position.copy(center);

            text.position.setX(0)
            text.position.setY(y_pos);
            text.position.setZ(size);


            textGeo2 = new TextGeometry( newText, {
                font: font,
                size: 4,
                height: 1,
                
            } );
            text2 = new THREE.Mesh(textGeo2, textMat);

            //center geometry
            var center = new THREE.Vector3();
            text2.geometry.computeBoundingBox();
            text2.geometry.boundingBox.getCenter(center);
            text2.geometry.center();
            text2.position.copy(center);

            text2.position.setX(5)
            text2.position.setY(y_pos);
            text2.position.setZ(-size);


            scene.add(text);
            scene.add(text2);
            globalThis.text2 = text2;
            globalThis.text = text;
        } );

        


    }

    constructor(scene, size, x_pos, y_pos, z_pos) {
        this.scene = scene;
        this.size = size;
        this.x_pos = x_pos;
        this.y_pos = y_pos;
        this.z_pos = z_pos;

        this.targetX = 0;
        this.targetY = 0;
        this.targetZ = 0;

        this.targetLookAt = new THREE.Vector3(0, this.y_pos, 1);
        this.targetLookAtInverse = new THREE.Vector3(0, this.y_pos, 1);
        
        this.idleRotOffset = Math.PI/9;

        this.geometry = new THREE.BoxGeometry(size, size, size);
        this.material = new THREE.MeshStandardMaterial( {color : '#034afc'} );

        this.cube = new THREE.Mesh(this.geometry, this.material);

        this.sphereGeo = new THREE.SphereGeometry(1);
        this.sphere = new THREE.Mesh(this.sphereGeo, this.material);



        this.scene.add(this.cube);
        this.scene.add(this.sphere);

        this.cube.position.set(x_pos, y_pos, z_pos);
        //this.sphere.position.set(2, 2, 2);
        this.oldTime = Date.now();

        this.idleSpeed = 0.0005;

        this.faceDirection = Math.PI/2;

        this.targetFaceDirection = Math.PI/2;

        this.oldTime2 = Math.round(Date.now()/1000, 0);

            var dt = new Date();
            this.updateText(this.scene, String(dt.getSeconds()));

    }


    update() {

        this.DeltaTime = Date.now() - this.oldTime;

        if (Math.round(Date.now()/1000, 0) > this.oldTime2) {
            this.targetFaceDirection += Math.PI;
            //console.log(this.oldTime2 + " " + Math.round(Date.now()/1000, 0));
            this.oldTime2 = Math.ceil(Date.now()/1000, 0);

        }

        if (Math.abs(this.targetFaceDirection-this.faceDirection) < Math.PI*.5) {
            console.log("magive");
            var dt = new Date();
            
            this.updateText(this.scene, String(dt.getSeconds()));

        }


        //this.faceDirection += 0.01
        this.faceDirection += (this.targetFaceDirection-this.faceDirection)*0.005*this.DeltaTime;


        
        this.sphere.position.set(20*Math.cos(this.faceDirection), this.y_pos, 20*Math.sin(this.faceDirection))

        globalThis.text.lookAt(this.targetLookAt);
        globalThis.text2.lookAt(this.targetLookAtInverse);

        globalThis.text.position.set(this.size/1.5*Math.cos(this.faceDirection), this.y_pos, this.size/1.5*Math.sin(this.faceDirection))
        globalThis.text2.position.set(this.size/1.5*Math.cos(this.faceDirection+Math.PI), this.y_pos, this.size/1.5*Math.sin(this.faceDirection+Math.PI));

        this.targetLookAt.set(20*Math.cos(this.faceDirection), this.y_pos, 20*Math.sin(this.faceDirection));
        this.targetLookAtInverse.set(20*Math.cos(this.faceDirection+Math.PI), this.y_pos, 20*Math.sin(this.faceDirection+Math.PI));

        this.cube.lookAt(this.targetLookAt);

        this.oldTime = Date.now();
        
    }


}