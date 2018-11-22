/**
 * MyTerrain class - Represents the primitive terrain
 */
class MyTerrain extends MyPlane {

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
        
        super(scene, parts, parts);

        this.idtexture = idtexture;
        this.idheightmap = idheightmap;
        this.parts = parts;
        this.heightscale = heightscale;

        this.currentShader = new CGFshader(this.scene.gl, "Shaders/texture3.vert", "Shaders/texture3.frag");
   
        this.currentShader.setUniformsValues({uSampler2: 1});
        
        this.heightTexture = this.idheightmap;
        this.colorTexture = this.idtexture;

        this.currentShader.setUniformsValues({normScale: this.heightscale});

        console.log(this.obj);

    };

    display(){

        this.scene.setActiveShader(this.currentShader);
        this.scene.pushMatrix();
        this.colorTexture.bind(0);
        this.scene.scale(5,5,5);
        this.plane.display();
        this.scene.popMatrix();
        this.scene.setActiveShader(this.scene.defaultShader);
    };

};