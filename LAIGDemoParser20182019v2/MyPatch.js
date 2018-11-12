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
    };
};