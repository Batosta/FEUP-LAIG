class KnightLine extends CGFobject
{
    constructor(scene){

        super(scene);

        this.board = [];
        this.boardPieces = [];
        this.move = [];
        this.player = 1;     // player = 1 = black || player = 0 = white
        this.pickNumber;

        this.pickFlag = null;

        this.green = new CGFappearance(this.scene);
        this.green.setAmbient(0.0, 0.5, 0.25, 1);
        this.gray = new CGFappearance(this.scene);
        this.gray.setAmbient(0.67, 0.67, 0.67, 1);
    };

    display() {   

        this.pickNumber = 1;

        var rows = this.boardPieces.length;
        var columns = this.boardPieces[0].length;

        let i;
        for(i = 0; i < this.boardPieces.length; i++){

            let line = this.boardPieces[i];
            let k;
            for(k = 0; k < line.length; k++){

                this.scene.pushMatrix();

                    this.gray.apply();
                    this.scene.translate(i/rows * 3, 3.8, k/columns * 3.5);

                    this.scene.registerForPick(this.pickNumber, line[k]);
                    line[k].display();

                this.scene.popMatrix();

                this.pickNumber++;
            }
        }
    };

    boardToPieces(board){

        this.boardPieces = [];
        let i;
        for(i = 0; i < board.length; i++){

            var linePieces = []
            let line = board[i];
            let k;
            for(k = 0; k < line.length; k++){

                var piece;
                if(line[k][0] == "empty")
                    piece = new MyCell(this.scene, line.length - k - 1, i);
                else if(line[k][0] == "white")
                    piece = new MyPiece(this.scene, 1, 0, line.length - k - 1, i);
                else if(line[k][0] == "black")
                    piece = new MyPiece(this.scene, 1, 1, line.length - k - 1, i);

                linePieces.push(piece);
            }

            this.boardPieces.push(linePieces);
        }
    };

    start(){

        this.scene.getPrologRequest('start');
    };

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

        this.boardToPieces(board);
        return board;
    };

    requestParser(board){

        let string = "";

        //Iniciar o Board
        string = string + "[";

        for(let i = 0; i < board.length; i++){

            var lines = board[i];

            //Iniciar a Linha
            string = string + "[";

            for(let j = 0; j < lines.length; j++){

                var cell = lines[j];
                
                string = string + "[" + cell[0] + ",";

                var number = parseInt(cell[1]);

                if( j == lines.length-1) string = string + number + "]";
                else string = string + number + "],";

            }

            //Finalizar a linha
            if(i == board.length-1) string = string + "]";
            else string = string + "],";

        }

        //Finalizar o Board
        string = string + "]";
        return string;
    };
} 