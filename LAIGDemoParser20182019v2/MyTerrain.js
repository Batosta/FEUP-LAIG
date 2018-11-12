/**
 * MyTerrain class - Represents the primitive terrain
 */
class MyTerrain extends CGFobject {

    /**
     * @constructor of the terrain
     *
     * @param scene - The global scene
     * @param idtexture - 
     * @param idheightmap - 
     * @param parts - 
     * @param heightscale - 
     */
    constructor(scene, idtexture, idheightmap, parts, heightscale) {
        super(scene);

        this.idtexture = idtexture;
        this.idheightmap = idheightmap;
        this.parts = parts;
        this.heightscale = heightscale;
    };
};