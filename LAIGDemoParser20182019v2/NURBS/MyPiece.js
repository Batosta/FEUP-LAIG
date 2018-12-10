/**
 * MyPiece class - Represents the primitive piece
 */
class MyPiece extends CGFobject {

    /**
     * @constructor of the stack of pieces
     *
     * @param scene - The global scene
     * @param pieces - The number of pieces in the stack
     * @param color - The color of the pieces
     */
    constructor(scene, pieces, color) {
        super(scene);

        this.isPiece = true;

        this.pieces = pieces * 0.5;
        this.color = color;
        this.slices = 20;
        this.stacks = 20;

        this.piece = new MyCylinder(this.scene, 1, 1, this.pieces, this.slices, this.stacks);
        this.circle = new MyCircle(this.scene, this.slices);


        this.red = new CGFappearance(this.scene);
        this.red.setAmbient(0.3, 0, 0, 1);
        this.black = new CGFappearance(this.scene);
        this.black.setAmbient(0.0, 0.0, 0.0, 1);
        this.white = new CGFappearance(this.scene);
        this.white.setAmbient(1.0, 1.0, 1.0, 1);
    };

    /**
     * Function that displays the whole vehicle
     */
    display() 
    {   

        this.scene.rotate(-Math.PI/2.0, 1, 0, 0);

        // Top of the stack
        this.scene.pushMatrix();
            this.red.apply();
            this.scene.translate(0, 0, this.pieces + 0.01);
            this.circle.display();
        this.scene.popMatrix();


        if(this.color == "black")
            this.black.apply();
        else
            this.white.apply();
        // Stack
        this.scene.pushMatrix();
            this.piece.display();
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