class MyBeach extends MyPlane{

    constructor(scene, texture, heightmap, mask){

        super(scene, 50, 50);

        this.texture = texture;
        this.heightmap = heightmap;
        this.mask = mask;

        this.shader = new CGFshader(this.scene.gl, "Shaders/beach.vert", "Shaders/beach.frag");

        this.updateValues();

    }

    updateValues(){
        this.shader.setUniformsValues({uTexture: 1});
        this.shader.setUniformsValues({uMask: 2});
        this.shader.setUniformsValues({uHeightMap: 3});
        this.shader.setUniformsValues({normScale: 0.2});
    }

    display(){
        this.scene.setActiveShader(this.shader);
        this.scene.pushMatrix();
        this.texture.bind(1);
        this.mask.bind(2);
        this.heightmap.bind(3);
        this.scene.scale(20,20,20);
        this.plane.display();
        this.scene.popMatrix();
        this.scene.setActiveShader(this.scene.defaultShader);
    }

}