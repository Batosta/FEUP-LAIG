/**
 * MyCylinder class - Represents the primitive cylinder
 */
class MyCylinder extends CGFobject {

    /**
     * @constructor of the cylinder
     *
     * @param scene - The global scene
     * @param base - Radius of the cylinder's base
     * @param top - Radius of the cylinder's top
     * @param height - Height of the cylinder
     * @param slices - Number of slices (vertices) for each stack of the cylinder
     * @param stacks - Number of stacks of the cylinder
     */
    constructor(scene, base, top, height, slices, stacks) {
        super(scene);

        this.base = base;
        this.top = top;
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;

        // A cylinder is made out of a "tube" and 2 cylinders
        this.tube = new MyTube(this.scene, this.base, this.top, this.height, this.slices, this.stacks);
        this.circle0 = new MyCircle(this.scene, this.slices);
        this.circle1 = new MyCircle(this.scene, this.slices);
    };

    /**
     * Function that displays the whole cylinder
     */
    display() 
    {   
        // The tube display
        this.scene.pushMatrix();
            this.tube.display();
        this.scene.popMatrix();

        // The top circle display
        this.scene.pushMatrix();
            this.scene.scale(this.top, this.top, 1.0);
            this.scene.translate(0.0, 0.0, this.height);
            this.circle0.display();
        this.scene.popMatrix();

        // The base circle display
        this.scene.pushMatrix();
            this.scene.scale(this.base, this.base, 1.0);
            this.scene.rotate(Math.PI, 0, 1, 0);
            this.circle1.display();
        this.scene.popMatrix();
    };

    /**
     * Function that updates the texture coordinates
     * @length_s - The length of the s component on each texture
     * @length_t - The length of the t component on each texture
     */
    updateTex(length_s, length_t){};

    update(time){};
};