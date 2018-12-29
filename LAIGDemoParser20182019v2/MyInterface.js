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

    addBackgroundsGroup(backgrounds) {

        var group = this.gui.addFolder("Backgrounds");
        group.open();

        group.add(this.scene, 'currentBackground', backgrounds).name("Background");
    }

    addGameGroup(scene) {

        var group = this.gui.addFolder("Game");
        group.open();
    
        group.add(this.scene, "startGame").name("Start Game");
    }

    /**
     * Function that adds the views
     * @param scene - Global scene
     * @param views - Views to be added
     */
    addViewsGroup(scene, views){
        this.gui.add(scene, 'currentView', views);
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