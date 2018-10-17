/**
 * MyCylinder
 * @constructor
 */
class MyCylinder extends CGFobject {
    constructor(scene, base, top, height, slices, stacks) {
        super(scene);

        this.base = base;
        this.top = top;
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;

        this.tube = new MyTube(this.scene, this.base, this.top, this.height, this.slices, this.stacks);
        this.circle0 = new MyCircle(this.scene, this.slices);
        this.circle1 = new MyCircle(this.scene, this.slices);

        this.initBuffers();
    };

    display() 
    {   
        this.scene.pushMatrix();
            this.tube.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.scale(this.top, this.top, 1.0);
            this.scene.translate(0.0, 0.0, this.height);
            this.circle0.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.scale(this.base, this.base, 1.0);
            this.scene.rotate(Math.PI, 0, 1, 0);
            this.circle1.display();
        this.scene.popMatrix();
    };
};