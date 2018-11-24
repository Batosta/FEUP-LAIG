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

        this.currentShader = new CGFshader(this.scene.gl, "Shaders/test.vert", "Shaders/test.frag");
   
        this.currentShader.setUniformsValues({texture: 1});
        this.currentShader.setUniformsValues({height: 2});
        this.currentShader.setUniformsValues({normScale: this.heightscale});

        this.height = this.idheightmap;
        this.texture = this.idtexture;
    };

    display(){

        this.scene.setActiveShader(this.currentShader);
        this.scene.pushMatrix();
        this.texture.bind(1);
        this.height.bind(2);
        this.scene.scale(10,10,10, 1);
        this.plane.display();
        this.scene.popMatrix();
        this.scene.setActiveShader(this.scene.defaultShader);
    };

    update(time){};

};