/**
 * MyCylinder2 class - Represents the primitive cylinder2
 */
class MyCylinder2 extends CGFobject {

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
    constructor(scene, base, top, height, slices, stacks) {
        super(scene);

        this.base = base;
        this.top = top;
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;

        this.cylinder2;

        this.isPiece = false;

        var degreeU = 1;
        var degreeV = 8;

        var w = Math.sqrt(2)/2.0;
        var controlvertexes = [
                            [
                                [0.0, -this.base, 0.0, 1],
                                [-this.base, -this.base, 0.0, w],
                                [-this.base, 0.0, 0.0, 1],
                                [-this.base, this.base, 0.0, w],
                                [0.0, this.base, 0.0, 1],
                                [this.base, this.base, 0.0, w],
                                [this.base, 0.0, 0.0, 1],
                                [this.base, -this.base, 0.0, w],
                                [0.0, -this.base, 0.0, 1]                       
                            ],
                            [
                                [0.0, -this.top, this.height, 1],
                                [-this.top, -this.top, this.height, w],
                                [-this.top, 0.0, this.height, 1],
                                [-this.top, this.top, this.height, w],
                                [0.0, this.top, this.height, 1],
                                [this.top, this.top, this.height, w],
                                [this.top, 0.0, this.height, 1],
                                [this.top, -this.top, this.height, w],
                                [0.0, -this.top, this.height, 1]                       
                            ]
                        ];


        this.makeSurface(degreeU, degreeV, controlvertexes);
    };

    makeSurface(degreeU, degreeV, controlvertexes) {

        var nurbsSurface = new CGFnurbsSurface(degreeU, degreeV, controlvertexes);
        var obj = new CGFnurbsObject(this.scene, this.stacks, this.slices, nurbsSurface); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)

        this.cylinder2 = obj;
    }

    /**
     * Function that updates the texture coordinates
     * @length_s - The length of the s component on each texture
     * @length_t - The length of the t component on each texture
     */
    updateTex(length_s, length_t){};

    display(){

        this.cylinder2.display();
    };

    update(time){};
};