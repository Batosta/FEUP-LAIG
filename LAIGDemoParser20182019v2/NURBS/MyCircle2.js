/**
 * MyCylinder2 class - Represents the primitive cylinder2
 */
class MyCircle2 extends CGFobject {

    /**
     * @constructor of the cylinder2
     *
     * @param scene - The global scene
     * @param base - 
     * @param top - 
     * @param height - 
     * @param slices - 
     * @param stacks - 
     */
    constructor(scene, slices, stacks) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;

        this.circle;

        var degreeU = 1;
        var degreeV = 2;

        var w = Math.sqrt(2)/2.0;
        var controlvertexes = [
                            [
                                [0.0, 1.0, 0.0, 1],
                                [1.0, 1.0, 0.0, w],
                                [1.0, 0.0, 0.0, 1]                      
                            ],
                            [
                                [0.0, 0.0, 0.0, 1],
                                [0.0, 0.0, 0.0, w],
                                [0.0, 0.0, 0.0, 1]                     
                            ]
                        ];


        this.makeSurface(degreeU, degreeV, controlvertexes);
    };

    makeSurface(degreeU, degreeV, controlvertexes) {

        var nurbsSurface = new CGFnurbsSurface(degreeU, degreeV, controlvertexes);
        var obj = new CGFnurbsObject(this.scene, this.stacks, this.slices, nurbsSurface); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)

        this.circle = obj;
    }

    /**
     * Function that updates the texture coordinates
     * @length_s - The length of the s component on each texture
     * @length_t - The length of the t component on each texture
     */
    updateTex(length_s, length_t){};

    display(){
        this.scene.pushMatrix();
        this.circle.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI/2, 0, 0, 1);
        this.circle.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.circle.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(3*Math.PI/2, 0, 0, 1);
        this.circle.display();
        this.scene.popMatrix();

        this.scene.translate(5,0,0);
    };

    update(time){};
};