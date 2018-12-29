class KnightLine extends CGFobject
{

    constructor(scene){

        super(scene);

        this.board = [];
        this.move = [];
        this.player = null;

        this.scene.client.getPrologRequest('start', this.scene.client.handleReply);

        this.display();
    }

    display() 
    {   

    };
} 