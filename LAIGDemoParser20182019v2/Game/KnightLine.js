class KnightLine extends CGFobject
{

    constructor(scene){

        super(scene);

        this.diamond = new MyDiamond(this.scene, 6);

        this.display();
    }

    display() 
    {   

        this.scene.pushMatrix();
            this.diamond.display();
        this.scene.popMatrix();
    };
} 