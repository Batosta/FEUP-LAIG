/**
 * MyPlane class - Represents the primitive plane
 */
class MyPlane extends CGFobject {

    /**
     * @constructor of the plane
     *
     * @param scene - The global scene
     * @param npartsU - 
     * @param npartsV - 
     */
    constructor(scene, npartsU, npartsV) {
        super(scene);

        this.npartsU = npartsU;
        this.npartsV = npartsV;
        this.scene = scene;

        this.plane;

        this.primitiveType = this.scene.gl.TRIANGLES;

        var degreeU = 1;
        var degreeV = 1;
        var controlvertexes = [
                            [
                                [0.5, 0.0, -0.5, 1 ],
                                [0.5, 0.0, 0.5, 1 ] 
                            ],
                            [
                                [-0.5, 0.0, -0.5, 1 ],
                                [-0.5,  0.0, 0.5, 1 ]                         
                            ]
                        ]

        this.makeSurface(degreeU, degreeV, controlvertexes);
    };

    /**
     * Creates a surface using NURBS
     */
    makeSurface(degreeU, degreeV, controlvertexes) {
            
        var nurbsSurface = new CGFnurbsSurface(degreeU, degreeV, controlvertexes);
        var obj = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, nurbsSurface); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)

        this.plane = obj;
    }

    /**
     * Function that updates the texture coordinates
     * @length_s - The length of the s component on each texture
     * @length_t - The length of the t component on each texture
     */
    updateTex(length_s, length_t){};

    /**
     * Function that overrides the display function
     */
    display(){

        this.plane.display();
    };

    update(time){};
};