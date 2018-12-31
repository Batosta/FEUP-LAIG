class KnightLine extends CGFobject
{

    constructor(scene){

        super(scene);

        this.board = [];
        this.move = [];
        this.player = null;
        this.pickNumber;

        this.cell = new MyCell(this.scene);
        this.blackPiece = new MyPiece(this.scene, 1, "black");
        this.whitePiece = new MyPiece(this.scene, 1, "white");
    }

    display(board) {   

        if(board != undefined){

            this.board = board;
        }

        if(this.board != undefined){

            this.pickNumber = 1;

            var rows = this.board.length;
            var columns = this.board[0].length;

            let i;
            for(i = 0; i < this.board.length; i++){

                let line = this.board[i];
                let k;
                for(k = 0; k < line.length; k++){

                    if(line[k][0] == "empty"){

                        this.scene.pushMatrix();
                            this.scene.translate(i/rows * 3, 3.8, k/columns * 3.5);
                            this.scene.rotate(-Math.PI/2.0, 1, 0, 0);
                            this.scene.registerForPick(this.pickNumber, this.cell);
                            this.cell.display();
                        this.scene.popMatrix();
                    }
                    else if(line[k][0] == "white"){

                        var numbPieces = line[k][1];
                        this.scene.pushMatrix();
                            this.scene.translate(i/rows * 3, 3.8, k/columns * 3.5);
                            this.scene.scale(1, numbPieces, 1);
                            this.scene.registerForPick(this.pickNumber, this.whitePiece);
                            this.whitePiece.display();
                        this.scene.popMatrix();
                    }
                    else if(line[k][0] == "black"){

                        var numbPieces = line[k][1];
                        this.scene.pushMatrix();
                            this.scene.translate(i/rows * 3, 3.8, k/columns * 3.5);
                            this.scene.scale(1, numbPieces, 1);
                            this.scene.registerForPick(this.pickNumber, this.blackPiece);
                            this.blackPiece.display();
                        this.scene.popMatrix();
                    }

                    this.pickNumber++;
                }
            }
        }
    };

    start(){

        this.scene.getPrologRequest('start');
    }

    responseParser(response){

        var board = [];

        var easier = response.slice(1, response.length - 1);
        var resp = easier.split(']],[[');

        // mold the strings into something like [[...],[...],[...]]
        let auxInit = "[[";
        let auxFinal = "]]";
        resp[0] = resp[0].concat(auxFinal);
        resp[resp.length - 1] = auxInit.concat(resp[resp.length - 1]);
        
        let i;
        for(i = 1; i < resp.length - 1; i++){

            resp[i] = auxInit.concat(resp[i]);
            resp[i] = resp[i].concat(auxFinal);
        }


        // build the board, line by line, cell by cell
        for(i = 0; i < resp.length; i++){

            var line = [];
            let lineStr = resp[i]; 
            let k;
            for(k = 2; k < lineStr.length - 1;){

                var cell = [];
                if(lineStr[k] == 'e'){

                    cell = ["empty", 0];
                    k += 10;
                }
                else if(lineStr[k] == 'b'){

                    if(lineStr[k + 7] == ']'){

                        cell = ["black", parseInt(lineStr[k + 6])];
                        k += 10;
                    }
                    else{

                        cell = ["black", parseInt(lineStr[k + 6] + lineStr[k + 7])];
                        k += 11;
                    }
                }
                else if(lineStr[k] == 'w'){

                    if(lineStr[k + 7] == ']'){

                        cell = ["white", parseInt(lineStr[k + 6])];
                        k += 10;
                    }
                    else{

                        cell = ["white", parseInt(lineStr[k + 6] + lineStr[k + 7])];
                        k += 11;
                    }
                }
                
                line.push(cell);
            }

            board.push(line);
        }

        return board;
    }
} 