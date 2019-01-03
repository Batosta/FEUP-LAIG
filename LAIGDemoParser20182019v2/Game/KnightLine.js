class KnightLine extends CGFobject
{
    constructor(scene){

        super(scene);

        this.board = [];
        this.boardPieces = [];
        this.waitingBoard = null;
        this.move = [];
        this.player = 1;     // player = 1 = black || player = 0 = white
        this.pickNumber;

        this.pieceFlag = null;
        this.cellFlag = null;
        this.numberPiecesFlag = null;

        this.startedTurnTime = 0;
        this.startedMovementTime = 0;
        this.pieceOnMovement = 0;
        this.movementUp = 0;
        this.movementZ = 0;
        this.movementX = 0;
        this.movementDown = 0;
        this.newPieces = [];
        this.movementDifferences = [];

        this.green = new CGFappearance(this.scene);
        this.green.setAmbient(0.0, 0.5, 0.25, 1);
        this.gray = new CGFappearance(this.scene);
        this.gray.setAmbient(0.67, 0.67, 0.67, 1);
    };

    display() {   

        this.showTime();

        this.pickNumber = 1;

        var rows = this.boardPieces.length;
        var columns = this.boardPieces[0].length;

        let i;
        for(i = 0; i < this.boardPieces.length; i++){

            let line = this.boardPieces[i];
            let k;

            for(k = 0; k < line.length; k++){

                if(this.pieceOnMovement == 1 && i == this.pieceFlag.yPosition && k == this.pieceFlag.xPosition){

                    this.scene.pushMatrix();

                        this.scene.translate(i, 3.8, -k);
                        this.newPieces[0].display();

                    this.scene.popMatrix();

                    var increase = (this.scene.lastTime - this.startedMovementTime)/1000.0;
                    if(this.movementUp == 0){

                        this.scene.pushMatrix();

                            let upValue = 3.8 + this.newPieces[0].pieces*0.15 + increase;
                            this.scene.translate(i, upValue, -k);
                            this.newPieces[1].display();

                        this.scene.popMatrix();

                        if(upValue >= 8){
                            this.movementUp = 1;
                            this.startedMovementTime = this.scene.lastTime;
                        }
                    }
                    else if(this.movementZ == 0){

                        let zValue = i + this.movementDifferences[0]*increase;
                        this.scene.pushMatrix();

                            this.scene.translate(zValue, 8.0, -k);
                            this.newPieces[1].display();

                        this.scene.popMatrix();

                        if(this.movementDifferences[0] < 0){

                            if(zValue <= this.cellFlag.yPosition){

                                this.movementZ = 1;
                                this.startedMovementTime = this.scene.lastTime;
                            }
                        }
                        else{

                            if(zValue >= this.cellFlag.yPosition){

                                this.movementZ = 1;
                                this.startedMovementTime = this.scene.lastTime;
                            }
                        }
                    }
                    else if(this.movementX == 0){

                        let xValue = -k + this.movementDifferences[1]*increase;
                        this.scene.pushMatrix();

                            this.scene.translate(this.cellFlag.yPosition, 8.0, xValue);
                            this.newPieces[1].display();

                        this.scene.popMatrix();

                        if(this.movementDifferences[1] < 0){

                            if(Math.abs(xValue) >= this.cellFlag.xPosition){

                                this.movementX = 1;
                                this.startedMovementTime = this.scene.lastTime;
                            }
                        }
                        else{

                            // console.log(xValue);
                            // console.log(Math.abs(xValue));
                            // console.log(this.cellFlag.xPosition);
                            if(Math.abs(xValue) <= this.cellFlag.xPosition){

                                this.movementX = 1;
                                this.startedMovementTime = this.scene.lastTime;
                            }
                        }
                    }
                    else if(this.movementDown == 0){

                        this.scene.pushMatrix();

                            let downValue = 8 - increase;
                            this.scene.translate(this.cellFlag.yPosition, downValue, -this.cellFlag.xPosition);
                            this.newPieces[1].display();

                        this.scene.popMatrix();

                        if(downValue <= 3.8){
                            this.movementDown = 1;
                            this.finishedMovement();
                        }
                    }
                }
                else{
                    this.scene.pushMatrix();

                        this.gray.apply();
                        this.scene.translate(i, 3.8, -k);

                        this.scene.registerForPick(this.pickNumber, line[k]);
                        line[k].display();

                    this.scene.popMatrix();
                }

                this.pickNumber++;
            }
        }
    };

    startMovement(prologResponse){

        this.waitingBoard = prologResponse;
        this.pieceOnMovement = 1;
        var newPiece1 = new MyPiece(this.scene, this.pieceFlag.pieces - this.numberPiecesFlag, this.player, this.pieceFlag.xPosition, this.pieceFlag.yPosition);
        var newPiece2 = new MyPiece(this.scene, parseInt(this.numberPiecesFlag), this.player, this.pieceFlag.xPosition, this.pieceFlag.yPosition);
        this.newPieces.push(newPiece1, newPiece2);
        this.startedMovementTime = this.scene.lastTime;
        this.calculateDifferences();
    };


    finishedMovement(){

        this.responseParser(this.waitingBoard);
        this.reset();
    };

    calculateDifferences(){

        let diffZ = this.pieceFlag.xPosition - this.cellFlag.xPosition;
        let diffX = -(this.pieceFlag.yPosition - this.cellFlag.yPosition);

        this.movementDifferences = [diffX, diffZ];
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
                    piece = new MyCell(this.scene, k, i);
                else if(line[k][0] == "white")
                    piece = new MyPiece(this.scene, line[k][1], 0, k, i);
                else if(line[k][0] == "black")
                    piece = new MyPiece(this.scene, line[k][1], 1, k, i);

                linePieces.push(piece);
            }

            this.boardPieces.push(linePieces);
        }
    };

    start(){

        this.scene.getPrologRequest('start');
    };

    askForPieces(){

        var flag = 0;
        var piecesAvailable, max, numberPieces;

        while(flag != 1){
            piecesAvailable = this.pieceFlag.pieces;
            max = piecesAvailable - 1;

            numberPieces = prompt("You have " + piecesAvailable.toString() + " pieces" + ".\n Please pick the number of pieces you wish to move (1.." + max.toString() + ")", "1");
            if(numberPieces > 0 && numberPieces <= max)
                flag = 1;
        }

        this.numberPiecesFlag = numberPieces;

        // move(Board, Player, Px, Py, Cx, Cy, Np)
        var request = "move(";
        request += this.requestParser(this.board);
        request += ",";
        request += this.player;
        request += ",";
        request += this.pieceFlag.xPosition;
        request += ",";
        request += this.pieceFlag.yPosition;
        request += ",";
        request += this.cellFlag.xPosition;
        request += ",";
        request += this.cellFlag.yPosition;
        request += ",";
        request += numberPieces;
        request += ")";
        this.scene.getPrologRequest(request);
    };

    reset(){

        this.switchPlayer();

        this.pieceFlag = null;
        this.cellFlag = null;
        this.numberPiecesFlag = null;
        this.startedTurnTime = this.scene.lastTime;
        this.waitingBoard = null;
        this.startedMovementTime = 0;
        this.pieceOnMovement = 0;
        this.movementUp = 0;
        this.movementZ = 0;
        this.movementX = 0;
        this.movementDown = 0;
        this.newPieces = [];
        this.movementDifferences = [];
    };

    switchPlayer(){

        if(this.player == 1)
            this.player = 0;
        else
            this.player = 1;
    };

    showTime(){

        var timeLeftPlay = 60 - Math.floor((this.scene.lastTime - this.startedTurnTime)/1000.0);
        // console.log(timeLeftPlay);
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
        this.board = board;
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