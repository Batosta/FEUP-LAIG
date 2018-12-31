/**
 * MyPatch class - Represents the primitive patch
 */
class MyPatch extends CGFobject {

    /**
     * @constructor of the patch
     *
     * @param scene - The global scene
     * @param npointsU - 
     * @param npointsV - 
     * @param npartsU - 
     * @param npartsV - 
     * @param controlpoints - Array of arrays, each with a different controlpoint
     */
    constructor(scene, npointsU, npointsV, npartsU, npartsV, controlpoints) {
        super(scene);

        this.npointsU = npointsU;
        this.npointsV = npointsV;
        this.npartsU = npartsU;
        this.npartsV = npartsV;
        this.controlpoints = controlpoints;

        this.patch;

        // The degrees are the number of points - 1
        var degreeU = this.npointsU - 1;
        var degreeV = this.npointsV - 1;

        this.makeSurface(degreeU, degreeV, this.controlpoints);
    };

    makeSurface(degreeU, degreeV, controlvertexes) {
            
        var nurbsSurface = new CGFnurbsSurface(degreeU, degreeV, controlvertexes);
        var obj = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, nurbsSurface); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)

        this.patch = obj;
    }

    /**
     * Function that updates the texture coordinates
     * @length_s - The length of the s component on each texture
     * @length_t - The length of the t component on each texture
     */
    updateTex(length_s, length_t){};

    display(){

        this.patch.display();
    };

    update(time){};
};