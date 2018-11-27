var DEGREE_TO_RAD = Math.PI / 180;

class MyDiamond extends CGFobject{

    constructor(scene, slices){
        
        super(scene);
        this.slices = slices;

        this.angleInc = 360/this.slices;

        this.x = 0.5 * Math.sin(this.angleInc); 

        this.z = 0.5 * Math.cos(this.angleInc)/2;

        this.angle = 0;

        this.triangle = new MyTriangle(this.scene, 0, -this.x, this.x, 1, 0, 0, 0, this.z, this.z);

    };

    display(){

        for(var i = 0; i < this.slices; i++){
            this.scene.pushMatrix();
                this.scene.rotate(this.angle*DEGREE_TO_RAD, 0, 1, 0);
                this.triangle.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
                this.scene.rotate(this.angle*DEGREE_TO_RAD, 0, 1, 0);
                this.scene.rotate(180*DEGREE_TO_RAD, 0, 0, 1);
                this.triangle.display();
            this.scene.popMatrix();

            this.angle += this.angleInc;
        }

    };

    update(time){};

    updateTex(length_s, length_t){};
};