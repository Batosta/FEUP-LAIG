/**
 * MyTerrain class - Represents the primitive terrain
 */
class MyTerrain extends MyPlane {

    /**
     * @constructor of the terrain
     *
     * @param scene - The global scene
     * @param idtexture - Texture of the terrain
     * @param idheightmap - Height map for the terrain
     * @param parts - Parts for the Plane
     * @param heightscale - Scaling factor for the terrain
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

        this.isPiece = false;
    };

    display(){

        this.scene.setActiveShader(this.currentShader);
        this.scene.pushMatrix();
        this.texture.bind(1);
        this.height.bind(2);
        this.scene.translate(0,-1,0);
        this.scene.scale(10,10,10, 1);
        this.plane.display();
        this.scene.popMatrix();
        this.scene.setActiveShader(this.scene.defaultShader);
    };

    update(time){};
};