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
    };
};