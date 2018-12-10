/**
 * MyWater class - Represents the primitive water
 */
class MyWater extends MyPlane {

    /**
     * @constructor of the water
     *
     * @param scene - The global scene
     * @param idtexture - The texture of the water
     * @param idwavemap - The height map of the water
     * @param parts - Parts for the Plane
     * @param heightscale - Scaling factor for the water
     * @param texscale - textscale for the water
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

        this.factor = 0;

        this.speed = 0.00005;

        this.wave = this.idwavemap;
        this.texture = this.idtexture;

        this.isPiece = false;
    };

    updateValues(){
        this.shader.setUniformsValues({texture: 1});
        this.shader.setUniformsValues({height: 2});
        this.shader.setUniformsValues({normScale: this.heightscale});
        this.shader.setUniformsValues({textScale: this.texscale});
    }

    update(time){
        
        var distance = this.speed * time;
        this.factor += distance;
        this.shader.setUniformsValues({timeFactor: this.factor});
    }

    display(){

        this.scene.setActiveShader(this.shader);
        this.scene.pushMatrix();
        this.texture.bind(1);
        this.wave.bind(2);
        this.scene.translate(0,-1.57,0);
        this.scene.scale(15,15,15, 1);
        this.plane.display();
        this.scene.popMatrix();
        this.scene.setActiveShader(this.scene.defaultShader);
    };

};