var DEGREE_TO_RAD = Math.PI / 180;

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
    }

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

        this.startTime = 0;
        this.gameStart = 0;
        this.knightLine = new KnightLine(this);

        this.setUpdatePeriod(1000/60);
        this.setPickEnabled(true);
    }
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
    }

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
    }


    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.camera = new CGFcamera(0.5, 0.1, 500, vec3.fromValues(40, 25, 40), vec3.fromValues(0, 0, 0));
    }
    
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
    }


    /* Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        this.camera = this.graph.viewMap.get(this.graph.defaultView);
        // this.interface.setActiveCamera(this.camera);

        this.axis = new CGFaxis(this, this.graph.axis_length);

        this.setGlobalAmbientLight(this.graph.ambientIllumination[0], this.graph.ambientIllumination[2], this.graph.ambientIllumination[3], this.graph.ambientIllumination[4]);
        this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);

        this.initLights();

        // this.interface.addLightsGroup(this.graph.lights);
        this.currentBackground = "Child Room";
        this.interface.addBackgroundsGroup(['Child Room', 'Christmas Room', 'Minecraft Room']);

        this.currentView = this.graph.defaultView;        
        this.interface.addViewsGroup(this, this.graph.currentView);

        this.start = null;
        this.interface.addGameGroup(this);


        this.sceneInited = true;
    }


    logPicking() {
        
        if (this.pickMode == false) {
            if (this.pickResults != null && this.pickResults.length > 0) {
                for (var i = 0; i< this.pickResults.length; i++) {
                    var obj = this.pickResults[i][0];
                    if (obj) {

                        if(obj.type == "piece"){                                // if it is a piece
                            if(obj.color == this.knightLine.player){            // if the piece is from the current player

                                var request = "checkPossibleMoves(";
                                request += this.knightLine.requestParser(this.knightLine.board);
                                request += ",";
                                request += obj.xPosition;
                                request += ",";
                                request += obj.yPosition;
                                request += ")";

                                console.log(request);
                            }
                        }
                    }

                    
                }
                this.pickResults.splice(0, this.pickResults.length);
            }     
        }
    }

    setRoot(){

        if(this.currentBackground == "Child Room")
            this.graph.root = "childroom_scene";
        else if(this.currentBackground == "Christmas Room")
            this.graph.root = "christmas_scene";
        else
            this.graph.root = "minecraft_scene";
    }

    /**
     * Displays the scene.
     */
    display() {

        // ---- BEGIN Background, camera and axis setup
        this.logPicking();

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

            // this.camera = this.graph.viewMap.get(this.currentView);
            // this.interface.setActiveCamera(this.camera);

            this.setRoot();
            this.graph.displayScene();

            if(this.gameStart == 1){

                this.knightLine.display();
            }
        }

        this.popMatrix();
    }

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
    }

    startGame(){

        this.knightLine.start();
        this.gameStart = 1;
    }


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
                var parsedArray = knightLine.responseParser(prologResponse);
                knightLine.board = parsedArray;
            }
            else{

                console.log("ainda nao fizemos essa parte")
            }

            requestString = null;
        };

        request.onerror = onError || 
        function(){

            console.log("Error waiting for response");
        };

        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        request.send();
    }
}