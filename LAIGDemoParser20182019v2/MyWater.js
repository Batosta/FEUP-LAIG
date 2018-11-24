/**
 * MyWater class - Represents the primitive water
 */
class MyWater extends MyPlane {

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

        super(scene, parts, parts);

        this.idtexture = idtexture;
        this.idwavemap = idwavemap;

        this.parts = parts;
        this.heightscale = heightscale;
        this.texscale = texscale;

        this.shader = new CGFshader(this.scene.gl, "Shaders/testwaves.vert", "Shaders/testwaves.frag");

        this.updateValues();

        this.wave = this.idwavemap;
        this.texture = this.idtexture;
    };

    updateValues(){
        this.shader.setUniformsValues({texture: 1});
        this.shader.setUniformsValues({height: 2});
        this.shader.setUniformsValues({normScale: this.heightscale});
    }

    update(time){
        var factor = (Math.sin((time * 3.0) % 3141 * 0.002) + 1.0)*0.5;
        console.log(factor);
        this.shader.setUniformsValues({timeFactor: factor});
    }

    display(){

        this.scene.setActiveShader(this.shader);
        this.scene.pushMatrix();
        this.texture.bind(1);
        this.wave.bind(2);
        this.scene.scale(20,20,20, 1);
        this.plane.display();
        this.scene.popMatrix();
        this.scene.setActiveShader(this.scene.defaultShader);
    };

};