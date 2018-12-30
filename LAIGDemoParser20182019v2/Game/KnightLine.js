class KnightLine extends CGFobject
{

    constructor(scene){

        super(scene);

        this.board = [];
        this.move = [];
        this.player = null;

        this.cell = new MyCell(this.scene);
        this.blackPiece = new MyPiece(this.scene, 1, "black");
        this.whitePiece = new MyPiece(this.scene, 1, "white");
    }

    display(board) {   

        if(board != undefined){

            this.board = board;
        }

        if(this.board != undefined){

            var rows = this.board.length;
            var columns = this.board[0].length;

            let i;
            for(i = 0; i < this.board.length; i++){

                let line = this.board[i];
                let k;
                for(k = 0; k < line.length; k++){

                    if(line[k][0] == "empty"){

                        this.scene.pushMatrix();
                            this.scene.translate(i/rows * 2.5, 3.8, k/columns * 3);
                            this.scene.rotate(-Math.PI/2.0, 1, 0, 0);
                            this.cell.display();
                        this.scene.popMatrix();
                    }
                    else if(line[k][0] == "white"){

                        var numbPieces = line[k][1];
                        this.scene.pushMatrix();
                            this.scene.translate(i/rows * 2.5, 3.8, k/columns * 3);
                            this.scene.scale(1, numbPieces, 1);
                            this.whitePiece.display();
                        this.scene.popMatrix();
                    }
                    else{

                        var numbPieces = line[k][1];
                        this.scene.pushMatrix();
                            this.scene.translate(i/rows * 2.5, 3.8, k/columns * 3);
                            this.scene.scale(1, numbPieces, 1);
                            this.blackPiece.display();
                        this.scene.popMatrix();
                    }
                }
            }
        }
    };

    start(){

        this.scene.getPrologRequest('start');
    }

    responseParser(response){

        var array = [[["empty",0],["black",3],["empty",0],["empty",0]],[["empty",0],["black",20],["white",20],["empty",0]],[["empty",0],["empty",0],["empty",0],["empty",0]],[["empty",0],["empty",0],["empty",0],["empty",0]]];
        return array;
    }
} 