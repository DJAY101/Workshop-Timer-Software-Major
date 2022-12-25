import * as THREE from 'three' 
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
export class clockCube {


    updateText(scene, newText)
    {
        if (this.currentText == newText) {return}
        this.currentText = newText

        //console.log("doing magic");

        var textGeo = null;
        var textGeo2 = null;
        var text = null;
        var text2 = null;
        var textMat = new THREE.MeshStandardMaterial( {color : '#FF961C'} );
        
        
        const size = this.size;
        const fontSize = size/2.2
        const y_pos = this.y_pos;
        
        scene.remove(this.text);
        scene.remove(this.text2);
        
        const SelfReference = this;

        const loader = new FontLoader();

        loader.load( '/fonts/Number.json', function ( font ) {

            textGeo = new TextGeometry( newText, {
                font: font,
                size: fontSize,
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
                size: fontSize,
                height: 1,
                
            } );
            text2 = new THREE.Mesh(textGeo2, textMat);

            //center geometry
            var center = new THREE.Vector3();
            text2.geometry.computeBoundingBox();
            text2.geometry.boundingBox.getCenter(center);
            text2.geometry.center();
            text2.position.copy(center);

            text2.position.setX(0)
            text2.position.setY(y_pos);
            text2.position.setZ(-size);

            if(!SelfReference.queuedDeletion) {
            scene.add(text);
            scene.add(text2);
            SelfReference.text2 = text2;
            SelfReference.text = text;
            }
        } );

        


    }

    constructor(scene, size, x_pos, y_pos, z_pos, rotSpeed) {
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
        this.material = new THREE.MeshStandardMaterial( {color : '#034afc', metalness: 0.2} );

        this.cube = new THREE.Mesh(this.geometry, this.material);
        this.updateText(this.scene, "00");

        // this.sphereGeo = new THREE.SphereGeometry(1);
        // this.sphere = new THREE.Mesh(this.sphereGeo, this.material);

        this.speed = rotSpeed;

        this.scene.add(this.cube);
        // this.scene.add(this.sphere);

        this.cube.position.set(x_pos, y_pos, z_pos);
        //this.sphere.position.set(2, 2, 2);
        this.oldTime = Date.now();

        this.idleSpeed = 0.0005;

        this.faceDirection = Math.PI/2;

        this.targetFaceDirection = Math.PI/2;

        this.oldTime2 = -1;

        this.queuedDeletion = false;

    }


    delete() {
        this.queuedDeletion = true;

        this.scene.remove(this.text);
        this.scene.remove(this.text2);
        this.scene.remove(this.cube);

    }

    update(number) {
        if(this.queuedDeletion) return;

        this.DeltaTime = Date.now() - this.oldTime;

        if (number != this.oldTime2) {
            this.targetFaceDirection += Math.PI;
            this.oldTime2 = number;
        }

        if (Math.abs(this.targetFaceDirection-this.faceDirection) < Math.PI*.5) {

            this.updateText(this.scene, String(number));

        }


        //this.faceDirection += 0.01
        this.faceDirection += (this.targetFaceDirection-this.faceDirection)*this.speed*this.DeltaTime;


        
        // this.sphere.position.set(20*Math.cos(this.faceDirection), this.y_pos, 20*Math.sin(this.faceDirection))

        



        this.targetLookAt.set((20*Math.cos(this.faceDirection)) + this.x_pos, this.y_pos, 20*Math.sin(this.faceDirection));
        this.targetLookAtInverse.set((20*Math.cos(this.faceDirection+Math.PI))+ this.x_pos, this.y_pos, 20*Math.sin(this.faceDirection+Math.PI));

        this.cube.lookAt(this.targetLookAt);

    
        
        if(this.text != null) {
        this.text.lookAt(this.targetLookAt);
        this.text2.lookAt(this.targetLookAtInverse);


        this.text.position.set((this.size/1.5*Math.cos(this.faceDirection)) + this.x_pos, this.y_pos, this.size/1.5*Math.sin(this.faceDirection))
        this.text2.position.set((this.size/1.5*Math.cos(this.faceDirection+Math.PI)) + this.x_pos, this.y_pos, this.size/1.5*Math.sin(this.faceDirection+Math.PI));
        }
        this.oldTime = Date.now();
        
    }


}