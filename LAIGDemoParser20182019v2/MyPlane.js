/**
 * MyPlane class - Represents the primitive plane
 */
class MyPlane extends CGFobject {

    /**
     * @constructor of the plane
     *
     * @param scene - The global scene
     * @param plane - 
     * @param patch - 
     * @param vehicle - 
     * @param cylinder2 - 
     * @param terrain - 
     * @param water - 
     */
    constructor(scene, plane, patch, vehicle, cylinder2, terrain, water) {
        super(scene);

        this.plane = plane;
        this.patch = patch;
        this.vehicle = vehicle;
        this.cylinder2 = cylinder2;
        this.terrain = terrain;
        this.water = water;
    };
};