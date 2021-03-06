var DEGREE_TO_RAD = Math.PI / 180;

/**
 * MyVehicle class - Represents the primitive vehicle
 */
class MyVehicle extends CGFobject {

    /**
     * @constructor of the vehicle
     *
     * @param scene - The global scene
     */
    constructor(scene) {
        super(scene);

        this.mainBody = new MyCylinder2(this.scene, 3, 3, 12.5, 30, 30);
        this.back1 = new MyCylinder2(this.scene, 2, 3, 5, 30, 30);
        this.back2 = new MyCylinder2(this.scene, 0.5, 2, 2.5, 30, 30);
        this.wing = new MyWing(this.scene);
        this.semiSphere2 = new MySemiSphere2(this.scene);
        this.helixAux = new MyCylinder2(this.scene, 0.25, 0.25, 1, 10, 10);
        this.helix = new MyPlane(this.scene, 10, 10);

        this.floaterHolder = new MyCylinder2(this.scene, 0.20, 0.20, 4, 10, 10);
        this.floater = new MyCylinder2(this.scene, 1.5, 1.5, 11, 20, 20);

        var controlpoints = [
                                [
                                    [ -1.5, -3.0, 0.0, 1 ],
                                    [ -1.5, 3.0, 0.0, 1 ]
                                ],
                                [
                                    [ 0.0, -3.0, 7.5, 0.5 ],
                                    [ 0.0, 3.0, 7.5, 0.5 ]                          
                                ],
                                [                           
                                    [ 1.5, -3.0, 0.0, 1 ],
                                    [ 1.5, 3.0, 0.0, 1 ]
                                ]
                            ];

        this.capsule = new MyPatch(this.scene, 3, 2, 20, 20, controlpoints);
        this.circle = new MyCircle(this.scene, 20);


        this.yellow = new CGFappearance(this.scene);
        this.yellow.setAmbient(0.9, 0.62, 0.1, 1);
 
        this.darkGray = new CGFappearance(this.scene);
        this.darkGray.setAmbient(0.35, 0.35, 0.35, 1);

        this.green = new CGFappearance(this.scene);
        this.green.setAmbient(0, 0.5, 0.25, 1);

        this.lightGray = new CGFappearance(this.scene);
        this.lightGray.setAmbient(0.8, 0.8, 0.8, 1);

        this.red = new CGFappearance(this.scene);
        this.red.setAmbient(0.3, 0, 0, 1);

        this.blue = new CGFappearance(this.scene);
        this.blue.setAmbient(0, 0, 0.3, 1);

        this.helixUpdate = 0; 
    };

    /**
     * Function that updates the texture coordinates
     * @length_s - The length of the s component on each texture
     * @length_t - The length of the t component on each texture
     */
    updateTex(length_s, length_t){};


    /**
     * Function that displays the whole vehicle
     */
    display() 
    {   

        this.yellow.apply();
        // The main body display
        this.scene.pushMatrix();
            this.mainBody.display();
        this.scene.popMatrix();
        // The first continuation of the main body display
        this.scene.pushMatrix();
        	this.scene.translate(0, 0, -5);
            this.back1.display();
        this.scene.popMatrix();
        // The second continuation of the main body display
        this.scene.pushMatrix();
        	this.scene.translate(0, 0, -7.5);
            this.back2.display();
        this.scene.popMatrix();


        this.red.apply();
        // The main left wing
        this.scene.pushMatrix();
            this.scene.translate(0, -1.5, 6.0);
            this.scene.rotate(Math.PI/2.0, 0, 1, 0);
            this.scene.rotate(Math.PI/2.0, 0, 0, 1);
            this.wing.display();
        this.scene.popMatrix();
        // The main right wing
        this.scene.pushMatrix();
            this.scene.translate(0, -1.5, 6.0);
            this.scene.rotate(-Math.PI/2.0, 0, 1, 0);
            this.scene.rotate(Math.PI/2.0, 0, 0, 1);
            this.wing.display();
        this.scene.popMatrix();


        // The main wings front cover
        this.scene.pushMatrix();
            this.scene.scale(13.5, 1, 1);
            this.scene.translate(0, -1.5, 6);
            this.circle.display();
        this.scene.popMatrix();
        // The main wings back cover
        this.scene.pushMatrix();
            this.scene.scale(13.5, 1, 1);
            this.scene.translate(0, -1.5, 6);
            this.scene.rotate(Math.PI, 0, 1, 0);
            this.circle.display();
        this.scene.popMatrix();


        this.green.apply();
        // The secondary left wing
        this.scene.pushMatrix();
            this.scene.scale(0.4, 0.3, 0.5);
            this.scene.translate(0, 0.0, -11.0);
            this.scene.rotate(Math.PI/2.0, 0, 1, 0);
            this.scene.rotate(Math.PI/2.0, 0, 0, 1);
            this.wing.display();
        this.scene.popMatrix();
        // The secondary right wing
        this.scene.pushMatrix();
            this.scene.scale(0.4, 0.3, 0.5);
            this.scene.translate(0, 0.0, -11.0);
            this.scene.rotate(-Math.PI/2.0, 0, 1, 0);
            this.scene.rotate(Math.PI/2.0, 0, 0, 1);
            this.wing.display();
        this.scene.popMatrix();
        // The secondary up wing
        this.scene.pushMatrix();
            this.scene.scale(0.4, 0.3, 0.5);
            this.scene.translate(0, 0.0, -11.0);
            this.scene.rotate(-Math.PI/2.0, 1, 0, 0);
            this.wing.display();
        this.scene.popMatrix();


        // The secondary wings front cover
        this.scene.pushMatrix();
            this.scene.scale(5.25, 0.25, 1);
            this.scene.translate(0, 0, -5.5);
            this.circle.display();
        this.scene.popMatrix();
        // The secondary wings back cover
        this.scene.pushMatrix();
            this.scene.scale(5.25, 0.25, 1);
            this.scene.translate(0, 0, -5.5);
            this.scene.rotate(Math.PI, 0, 1, 0);
            this.circle.display();
        this.scene.popMatrix();
        // The secondary up wing front cover
        this.scene.pushMatrix();
            this.scene.scale(0.35, 2.5, 1);
            this.scene.translate(0, 0.6, -5.5);
            this.circle.display();
        this.scene.popMatrix();
        // The secondary up wing back cover
        this.scene.pushMatrix();
            this.scene.scale(0.35, 2.5, 1);
            this.scene.translate(0, 0.6, -5.5);
            this.scene.rotate(Math.PI, 0, 1, 0);
            this.circle.display();
        this.scene.popMatrix();


        this.red.apply();
        // Front protection
        this.scene.pushMatrix();
            this.scene.translate(0, -0.55, 12.5);
            this.scene.scale(2.25, 2.4, 1.0);
            this.scene.rotate(Math.PI/2.0, 1, 0, 0);
            this.semiSphere2.display();
        this.scene.popMatrix();
        // Back protection
        this.scene.pushMatrix();
            this.scene.translate(0.0, -0.09, -7.5);
            this.scene.scale(0.38, 0.4, 0.15);
            this.scene.rotate(-Math.PI/2.0, 1, 0, 0);
            this.semiSphere2.display();
        this.scene.popMatrix();


        this.lightGray.apply();

        // Helix holder
        this.scene.pushMatrix();
            this.scene.translate(0, -0.5, 13.4);
            this.helixAux.display();
        this.scene.popMatrix();


        // Helix 1
        this.scene.pushMatrix();
            this.scene.translate(0, -0.5, 14.4);
            this.scene.rotate(this.helixUpdate*DEGREE_TO_RAD, 0, 0, 1);
            this.scene.scale(7.5, 1, 1);
            this.scene.rotate(Math.PI/2.0, 1, 0, 0);
            this.helix.display();
        this.scene.popMatrix();
        // Helix 2
        this.scene.pushMatrix();
            this.scene.translate(0, -0.5, 14.4);
            this.scene.rotate(this.helixUpdate*DEGREE_TO_RAD, 0, 0, 1);
            this.scene.scale(7.5, 1, 1);
            this.scene.rotate(-Math.PI/2.0, 1, 0, 0);
            this.helix.display();
        this.scene.popMatrix();
        // Helix 3
        this.scene.pushMatrix();
            this.scene.translate(0, -0.5, 14.4);
            this.scene.rotate(this.helixUpdate*DEGREE_TO_RAD, 0, 0, 1);
            this.scene.rotate(Math.PI/2.0, 0, 0, 1);
            this.scene.scale(7.5, 1, 1);
            this.scene.rotate(Math.PI/2.0, 1, 0, 0);
            this.helix.display();
        this.scene.popMatrix();
        // Helix 4
        this.scene.pushMatrix();
            this.scene.translate(0, -0.5, 14.4);
            this.scene.rotate(this.helixUpdate*DEGREE_TO_RAD, 0, 0, 1);
            this.scene.rotate(Math.PI/2.0, 0, 0, 1);
            this.scene.scale(7.5, 1, 1);
            this.scene.rotate(-Math.PI/2.0, 1, 0, 0);
            this.helix.display();
        this.scene.popMatrix();

        this.darkGray.apply();
        // Capsule
        this.scene.pushMatrix();
            this.scene.translate(0, 1, 7);
            this.scene.rotate(-Math.PI/2.0, 1, 0, 0);
            this.capsule.display();
        this.scene.popMatrix();
        // Capsule front
        this.scene.pushMatrix();
            this.scene.scale(1.25, 2, 1);
            this.scene.translate(0, 0.75, 10);
            this.circle.display();
        this.scene.popMatrix();
        // Capsule back
        this.scene.pushMatrix();
            this.scene.scale(1.25, 2, 1);
            this.scene.translate(0, 0.75, 4);
            this.scene.rotate(Math.PI, 0, 1, 0);
            this.circle.display();
        this.scene.popMatrix();


        this.lightGray.apply();
        // Floater Holder 1
        this.scene.pushMatrix();
            this.scene.translate(1, -1, 11)
            this.scene.rotate(Math.PI/6.0, 0, 0, 1);
            this.scene.rotate(Math.PI/2.0, 1, 0, 0);
            this.floaterHolder.display();
        this.scene.popMatrix();
        // Floater Holder 2
        this.scene.pushMatrix();
            this.scene.translate(-1, -1, 11)
            this.scene.rotate(-Math.PI/6.0, 0, 0, 1);
            this.scene.rotate(Math.PI/2.0, 1, 0, 0);
            this.floaterHolder.display();
        this.scene.popMatrix();
        // Floater Holder 3
        this.scene.pushMatrix();
            this.scene.translate(1, -1, 2)
            this.scene.rotate(Math.PI/6.0, 0, 0, 1);
            this.scene.rotate(Math.PI/2.0, 1, 0, 0);
            this.floaterHolder.display();
        this.scene.popMatrix();
        // Floater Holder 4
        this.scene.pushMatrix();
            this.scene.translate(-1, -1, 2);
            this.scene.rotate(-Math.PI/6.0, 0, 0, 1);
            this.scene.rotate(Math.PI/2.0, 1, 0, 0);
            this.floaterHolder.display();
        this.scene.popMatrix();


        this.blue.apply();
        // Left Floater
        this.scene.pushMatrix();
            this.scene.translate(3, -5, 1);
            this.floater.display();
        this.scene.popMatrix();
        // Right Floater
        this.scene.pushMatrix();
            this.scene.translate(-3, -5, 1);
            this.floater.display();
        this.scene.popMatrix();


        // Left Floater Front Protection
        this.scene.pushMatrix();
            this.scene.translate(3, -5.25, 11.9);
            this.scene.scale(1.15, 1.2, 1.0);
            this.scene.rotate(Math.PI/2.0, 1, 0, 0);
            this.semiSphere2.display();
        this.scene.popMatrix();
        // Right Floater Front Protection
        this.scene.pushMatrix();
            this.scene.translate(-3, -5.25, 11.9);
            this.scene.scale(1.15, 1.2, 1.0);
            this.scene.rotate(Math.PI/2.0, 1, 0, 0);
            this.semiSphere2.display();
        this.scene.popMatrix();

        // Left Floater Back Protection
        this.scene.pushMatrix();
            this.scene.translate(3, -5.25, 1.1);
            this.scene.scale(1.15, 1.2, 1.0);
            this.scene.rotate(-Math.PI/2.0, 1, 0, 0);
            this.semiSphere2.display();
        this.scene.popMatrix();
        // Right Floater Back Protection
        this.scene.pushMatrix();
            this.scene.translate(-3, -5.25, 1.1);
            this.scene.scale(1.15, 1.2, 1.0);
            this.scene.rotate(-Math.PI/2.0, 1, 0, 0);
            this.semiSphere2.display();
        this.scene.popMatrix();
    };

    update(time){

        this.helixUpdate += 30;

    };
};