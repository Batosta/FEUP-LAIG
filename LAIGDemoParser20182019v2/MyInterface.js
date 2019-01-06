/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        this.initKeys();

        return true;
    }

    /**
     * Adds a folder containing the IDs of the lights passed as parameter.
     * @param {array} lights
     */
    addLightsGroup(lights) {

        var group = this.gui.addFolder("Lights");
        group.open();

        // add two check boxes to the group. The identifiers must be members variables of the scene initialized in scene.init as boolean
        // e.g. this.option1=true; this.option2=false;

        for (var key in lights) {
            if (lights.hasOwnProperty(key)) {
                this.scene.lightValues[key] = lights[key][0];
                group.add(this.scene.lightValues, key);
            }
        }
    }

    /**
     * Function that adds the game difficulties types and the start button
     * @param difficulties - Difficulties to be added
     * @param types - Types to be added
     */
    addGameGroup(difficulties, types) {

        var group = this.gui.addFolder("Game Controls");
        group.open();
    
        group.add(this.scene, "startGame").name("Start Game");
        group.add(this.scene, "undo").name("Undo last play");
        group.add(this.scene, 'gameDifficulty', ['Easy', 'Hard']).name("Difficulty");
        group.add(this.scene, 'gameType', types).name("Game Type");
    }

    /**
     * Function that adds the views and backgrounds
     * @param views - Views to be added
     * @param backgrounds - Backgrounds to be added
     */
    addViewsGroup(views, backgrounds){

        var group = this.gui.addFolder("Views Controls");
        group.open();

        group.add(this.scene, 'currentView', views).name("Views");
        group.add(this.scene, 'currentBackground', backgrounds).name("Background");
    }

    /**
     * Function that initializes the keyboard keys
     */
    initKeys(){
        this.scene.gui = this;
        this.processKeyboard = function(){};
        this.activeKeys={};
    }

    /**
     * Function that checks if a certain key is being pressed
     * @param event - The event to be checked
     */
    processKeyDown(event){
        this.activeKeys[event.code]=true;
    }

    /**
     * Function that checks if a certain key is not being pressed
     * @param event - The event to be checked
     */
    processKeyUp(event){
        this.activeKeys[event.code]=false;
    }

    /**
     * Function that checks if a certain key has been pressed
     * @param keyCode - The code of a certain key
     */
    isKeyPressed(keyCode){
        return this.activeKeys[keyCode] || false;
    }

    /**
     * Function that checks if a certain key has been released
     * @param keyCode - The code of a certain key
     */
    isKeyReleased(keyCode){
        if(this.activeKeys[keyCode])
            return false;
        else
            return true;
    }
}