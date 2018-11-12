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
    };
};