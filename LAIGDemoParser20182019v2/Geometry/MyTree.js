var DEGREE_TO_RAD = Math.PI / 180;

class MyTree extends CGFobject{


    constructor(scene, coneHeight, baseRadius, ch, cb, nt, tm){
        super(scene);

        this.coneHeight = coneHeight;
        this.baseRadius = baseRadius;

        this.tm = tm;

        this.numberTriangles = nt;

        this.triangleBase = cb;

        this.triangleHeight = ch;

        this.cone = new MyCylinder(this.scene, this.baseRadius, 0.0, this.coneHeight, 20, 20);

        this.height = this.coneHeight - this.triangleHeight;

        this.angle = 0;

        this.angleInc = 360/nt;

        this.triangle = new MyTriangle(this.scene, 0, -this.triangleBase/2, this.triangleBase/2, this.coneHeight, this.height, this.height, 0, 0, 0);
    
        this.isPiece = false;
    }

    display(){

        for(var i = 0; i < this.numberTriangles; i++){
            this.scene.pushMatrix();
                this.scene.rotate(this.angle*DEGREE_TO_RAD, 0, 1, 0);
                this.triangle.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
                this.scene.rotate((this.angle+180)*DEGREE_TO_RAD, 0, 1, 0);
                this.triangle.display();
            this.scene.popMatrix();

            this.angle += this.angleInc;
        }
        this.scene.pushMatrix();
            this.scene.rotate(-Math.PI/2, 1, 0, 0);
            this.tm.apply();
            this.cone.display();
        this.scene.popMatrix();
    }

    updateTex(length_s, length_t){};

	update(time){};

};