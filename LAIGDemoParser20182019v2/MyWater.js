/**
 * MyWater class - Represents the primitive water
 */
class MyWater extends CGFobject {

    /**
     * @constructor of the water
     *
     * @param scene - The global scene
     * @param idtexture - 
     * @param idwavemap - 
     * @param parts - 
     * @param heightscale - 
     * @param texscale - 
     */
    constructor(scene, idtexture, idwavemap, parts, heightscale, texscale) {
        super(scene);

        this.idtexture = idtexture;
        this.idwavemap = idwavemap;
        this.parts = parts;
        this.heightscale = heightscale;
        this.texscale = texscale;
    };
};