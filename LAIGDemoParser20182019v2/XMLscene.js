var DEGREE_TO_RAD = Math.PI / 180;

var initialBoard = [[["empty",0],["empty",0],["empty",0],["empty",0]],[["empty",0],["black",20],["white",20],["empty",0]],[["empty",0],["empty",0],["empty",0],["empty",0]]];

/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor 
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;
        this.lightValues = {};
    };

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;

        this.initCameras();

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);

        this.keyMPressed = false;

        this.gameStart = 0;
        this.knightLine = new KnightLine(this);

        this.setUpdatePeriod(1000/60);
        this.setPickEnabled(true);
    };
    /* 
     * Calls the update function over time to update the animations with the time, the water shaders and the helix for the airplane.
     */
    update(currTime){
        var today = new Date();

        currTime -= today.getTimezoneOffset()*60*1000;

        this.lastTime = this.lastTime || 0;
        this.deltaTime = currTime - this.lastTime;
        this.lastTime = currTime;

        if(this.sceneInited){
            var components = this.graph.nodes;
            for(var i = 0; i < components.length; i++){
                for(var j = 0; j < components[i].animations.length; j++){
                    if(components[i].animations[j].counter != components[i].animations[j].span){
                        components[i].animations[j].update(this.deltaTime);
                        break;
                    }
                }
                for(var j = 0; j < components[i].primitives.length; j++){
                    this.graph.primitiveMap.get(components[i].primitives[j]).update(this.deltaTime);
                }
            }
        }

        this.updateCameras();
    };

    updateCameras(){

        if(this.currentView == "Game Perspective"){

            if(this.camera.position[0] < 5)
                this.camera.position[0] += 0.1;

            if(this.camera.position[1] < 15)
                this.camera.position[1] += 0.1;

            if(this.camera.position[2] > 0)
                this.camera.position[2] -= 0.1;
        }
        else{

            if(this.camera.position[0] > 0)
                this.camera.position[0] -= 0.1;

            if(this.camera.position[1] > 12.5)
                this.camera.position[1] -= 0.1;

            if(this.camera.position[2] > 0)
                this.camera.position[2] -= 0.1;
        }
    };

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.camera = new CGFcamera(0.5, 0.1, 500, vec3.fromValues(40, 25, 40), vec3.fromValues(0, 0, 0));
    };
    
    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;            

            if (this.graph.lights.hasOwnProperty(key)) {
                var light = this.graph.lights[key];

                //lights are predefined in cgfscene
                this.lights[i].setPosition(light[1][0], light[1][1], light[1][2], light[1][3]);
                this.lights[i].setAmbient(light[2][0], light[2][1], light[2][2], light[2][3]);
                this.lights[i].setDiffuse(light[3][0], light[3][1], light[3][2], light[3][3]);
                this.lights[i].setSpecular(light[4][0], light[4][1], light[4][2], light[4][3]);

                if(light[5].length != 0){
                    this.lights[i].setSpotCutOff(light[5][0]);
                    this.lights[i].setSpotExponent(light[5][1]);
                }
                if(light[6].length != 0){//Não sei se é esta a função
                    this.lights[i].setSpotDirection(light[6][0]);
                    this.lights[i].setSpotDirection(light[6][1]);
                    this.lights[i].setSpotDirection(light[6][2]);
                }

                this.lights[i].setVisible(true);
                if (light[0])
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                this.lights[i].update();

                i++;
            }
        }
    };


    /* Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        this.camera = this.graph.viewMap.get(this.graph.defaultView);
        //this.interface.setActiveCamera(this.camera);

        this.axis = new CGFaxis(this, this.graph.axis_length);

        this.setGlobalAmbientLight(this.graph.ambientIllumination[0], this.graph.ambientIllumination[2], this.graph.ambientIllumination[3], this.graph.ambientIllumination[4]);
        this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);

        this.initLights();

        this.start = null;
        this.gameDifficulty = "Easy";
        this.gameType = "Player vs Player";
        this.interface.addGameGroup(['Easy', 'Hard'], ['Player vs Player', 'Player vs Bot', 'Bot vs Bot']);

        this.currentBackground = "Child Room";
        this.currentView = this.graph.defaultView;        
        this.interface.addViewsGroup(this.graph.currentView, ['Child Room', 'Christmas Room', 'Minecraft Room']);

        this.sceneInited = true;
    };


    logPicking() {
        
        if (this.pickMode == false) {
            if (this.pickResults != null && this.pickResults.length > 0) {
                for (var i = 0; i< this.pickResults.length; i++) {
                    var obj = this.pickResults[i][0];
                    if (obj) {
                        if(obj.type == "piece"){
                            if(obj.color == this.knightLine.player && obj.pieces > 1){

                                this.selectPiece(obj);
                            }
                        }
                        else if(obj.type == "cell"){

                            if(this.knightLine.pieceFlag != null){

                                // checkPossibleMove(Board, Px, Py, Cx, Cy)
                                var request = "checkPossibleMove(";
                                request += this.knightLine.requestParser(this.knightLine.board);
                                request += ",";
                                request += this.knightLine.pieceFlag.xPosition;
                                request += ",";
                                request += this.knightLine.pieceFlag.yPosition;
                                request += ",";
                                request += obj.xPosition;
                                request += ",";
                                request += obj.yPosition;
                                request += ")";
                                this.knightLine.cellFlag = obj;
                                this.getPrologRequest(request);
                            }
                        }
                    }
                }
                this.pickResults.splice(0, this.pickResults.length);
            }     
        }
    };

    selectPiece(obj){

        if(obj.selected == 1 && this.knightLine.pieceFlag != null){
            obj.selected = 0;
            this.knightLine.pieceFlag = null;
        }
        else if(obj.selected == 0 && this.knightLine.pieceFlag == null){
            obj.selected = 1;
            this.knightLine.pieceFlag = obj;
        }
    };

    setRoot(){

        if(this.currentBackground == "Child Room")
            this.graph.root = "childroom_scene";
        else if(this.currentBackground == "Christmas Room")
            this.graph.root = "christmas_scene";
        else
            this.graph.root = "minecraft_scene";
    };

    /**
     * Displays the scene.
     */
    display() {

        // ---- BEGIN Background, camera and axis setup

        this.gameplay();

        this.clearPickRegistration();

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        // Draw axis
        this.axis.display();

        this.pushMatrix();

        if (this.sceneInited) {

            this.checkKeys();

            var i = 0;
            for (var key in this.lightValues) {
                if (this.lightValues.hasOwnProperty(key)) {
                    if (this.lightValues[key]) {
                        this.lights[i].setVisible(true);
                        this.lights[i].enable();
                    }
                    else {
                        this.lights[i].setVisible(false);
                        this.lights[i].disable();
                    }
                    this.lights[i].update();
                    i++;
                }
            }

            this.setRoot();
            this.graph.displayScene();

            if(this.gameStart == 1){

                this.knightLine.display();
            }
        }

        this.popMatrix();
    };

    /**
     * Function that takes care of the response to the M key being pressed.
     */
    checkKeys(){

        if(this.gui.isKeyPressed("KeyM") && this.keyMPressed == false){
            this.keyMPressed = true;
        }
        if(this.gui.isKeyReleased("KeyM") && this.keyMPressed == true){
            console.log("m");
            this.graph.counterMaterial++;
            this.keyMPressed = false;
        }
    };

    startGame(){

        this.knightLine.start();
        this.gameStart = 1;
        this.knightLine.startedTurnTime = this.lastTime;
    };

    playMovie(){

        var boardAux = this.knightLine.board;

        this.knightLine.board = [];

        this.getPrologRequest('start');

        this.knightLine.board = initialBoard;

        //JUST TO TEST
        this.knightLine.movie = [[1,1,1,3,2,"3"],[0,3,2,1,1,"5"],[1,2,2,4,1,"4"],[0,3,2,1,3,"3"]];

        for(let i = 0; i < this.knightLine.movie.length; i++){

            let movie = this.knightLine.movie[i];
    
            // move(Board, Player, Px, Py, Cx, Cy, Np)
            var request = "move(";
            request +=  this.knightLine.requestParser(this.knightLine.board);
            request += ",";
            request += movie[0].toString();
            request += ",";
            request += movie[1].toString();
            request += ",";
            request += movie[2].toString();
            request += ",";
            request += movie[3].toString();
            request += ",";
            request += movie[4].toString();
            request += ",";
            request += movie[5].toString();
            request += ")";
            this.getPrologRequest(request);
        }

        console.log("YIKES");
    }

    gameplay(){

        if(this.knightLine.pieceOnMovement == 0){
            if(this.gameType == "Player vs Player" || (this.gameType == "Player vs Bot" && this.knightLine.player == 1)){

                this.logPicking();
            }
            else if(this.gameType == "Bot vs Bot" || (this.gameType == "Player vs Bot" && this.knightLine.player == 0)){

                if(this.gameDifficulty == "Easy")
                    this.knightLine.botMove(1);
                else
                    this.knightLine.botMove(2);
            }
        }
    };

    undo(){
        if(JSON.stringify(this.knightLine.board) === JSON.stringify(initialBoard))
            console.log("Can't Undo at the start!");
        else this.knightLine.undoPlay();
    };

    getPrologRequest(requestString, onSuccess, onError, port){
    
        var requestPort = port || 8081;
        var request = new XMLHttpRequest();

        request.open('GET', "http://localhost:" + requestPort + "/" + requestString, true);

        var knightLine = this.knightLine;

        request.onload = onSuccess || 
        function(data){
            
            var prologResponse = data.target.response;

            if(requestString == "start"){

                console.log("Request successful. Reply: " + prologResponse);

                knightLine.responseParser(prologResponse);
            }

            else if(requestString.includes("checkPossibleMove")){

                // prologResponse = 0 = can play || 1 = cant play
                console.log("Request successful. Reply: " + prologResponse);
                
                if(prologResponse == 0){

                    knightLine.askForPieces();
                }
            }

            else if(requestString.includes("move")){

                console.log("Request successful. Reply: " + prologResponse);

                knightLine.startMovement(prologResponse);

            }

            else if(requestString.includes("checkWin")){

                console.log("Request successful. Reply: " + prologResponse);

                if(parseInt(prologResponse) == 1){
                    knightLine.movie = [];
                    console.log("YOU WON");
                }   
                else
                    knightLine.checkLose();

            }

            else if(requestString.includes("checkIfPossible")){

                console.log("Request successful. Reply: " + prologResponse);

                if(parseInt(prologResponse) == 1){
                    knightLine.movie = [];
                    console.log("YOU LOST");
                }
                else
                    knightLine.reset();

            }

            else if(requestString.includes("botMove")){

                console.log("Request successful. Reply: " + prologResponse);

                knightLine.startBotMovement(prologResponse);
            }

            requestString = null;
        };

        request.onerror = onError || 
        function(){

            console.log("Error waiting for response");
        };

        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        request.send();
    };
}