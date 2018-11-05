// Multiplier to convert from degree to radians
var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var ANIMATIONS_INDEX = 7;
var PRIMITIVES_INDEX = 8;
var COMPONENTS_INDEX = 9;

// Map that contains all the transformations
var transformMap = new Map();

// Map that contains all the materials
var materialMap = new Map();

// Map that contains all the textures
var textureMap = new Map();

// Map that contains all the primitives
var primitiveMap = new Map();

// Map that contains all the animations
var animationsMap = new Map();

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * @constructor
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        this.rectangle = null;
        this.triangle = null;
        this.cylinder = null;
        this.sphere = null;
        this.torus = null;                    

        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);

        // The views map is defined here since we need to have access to the views in the XMLscene
        this.viewMap = new Map();

        this.defaultView = null;
        
        this.currentView = [];

        this.counterMaterial = 0;

        //Speed que vai ser utilizada para as animacoes
        this.speed = 1;
    }


    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");

        var rootElement = this.reader.xmlDoc.documentElement;

        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        this.scene.onGraphLoaded();
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {

        if (rootElement.nodeName != "yas")
            return "root tag <yas> missing";

        //scene, views, ambient, lights, textures, materials, transformations, primitives, components blocks
        var nodes = rootElement.children;
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // <SCENE>
        var index;
        if ((index = nodeNames.indexOf("scene")) == -1)
            return this.onXMLError("tag <scene> missing");
        else {
            if (index != SCENE_INDEX)
                this.onXMLMinorError("tag <scene> out of order");

            //Parse INITIAL block
            if ((error = this.parseScene(nodes[index])) != null)
                return error;
        }

        // <AMBIENT>
        if((index =nodeNames.indexOf("ambient")) == -1)
            return this.onXMLError("tag <ambient> missing");
        else{
            if(index != AMBIENT_INDEX)
                this.onXMLMinorError("tag <ambient> out of order");
            //Parse AMBIENT block
            if((error = this.parseAmbient(nodes[index])) != null)
                return error;
        }

        // <VIEWS>
        if ((index = nodeNames.indexOf("views")) == -1)
            return this.onXMLError("tag <views> missing");
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseViews(nodes[index])) != null)
                return error;
        }

        // <LIGHTS>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return this.onXMLError("tag <lights> missing");
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse LIGHTS block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }

        // <TEXTURES>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return this.onXMLError("tag <textures> missing");
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse TEXTURES block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <MATERIALS>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return this.onXMLError("tag <materials> missing");
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse MATERIALS block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }
        // <TRANSFORMATIONS>
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return this.onXMLError("tag <transformations> missing");
        else {
            if (index != TRANSFORMATIONS_INDEX)
                this.onXMLMinorError("tag <transformations> out of order");

            //Parse NODES block
            if ((error = this.parseTransformations(nodes[index])) != null)
                return error;
        }

        // <ANIMATIONS>
        if ((index = nodeNames.indexOf("animations")) == -1)
            return this.onXMLError("tag <animations> missing");
        else {
            if (index != ANIMATIONS_INDEX)
                this.onXMLMinorError("tag <animations> out of order");

            //Parse ANIMATIONS block
            if ((error = this.parseAnimations(nodes[index])) != null)
                return error;
        }

        //<PRIMITIVES>
        if((index = nodeNames.indexOf("primitives")) == -1)
            return this.onXMLError("tag <Primitives> missing");
        else{
            if(index != PRIMITIVES_INDEX)
                this.onXMLMinorError("tag <primitives> out of order");
            
            //Parse PRIMITIVES block 
            if((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }

        //<COMPONENTS>
        if((index = nodeNames.indexOf("components")) == -1)
            return this.onXMLError("tag <components> missing");
        else{
            if(index != COMPONENTS_INDEX)
                this.onXMLMinorError("tag <components> out of order");
            
            //Parse COMPONENTS block 
            if((error = this.parseComponents(nodes[index])) != null)
                return error;
        }

    }

    /**
    * Parses the <SCENE> block
    */
    parseScene(sceneNode){

        this.root = this.reader.getString(sceneNode, 'root');
        this.axis_length = this.reader.getFloat(sceneNode, 'axis_length');

        if(this.root == null)
            return this.onXMLError("root missing.");

        // Length of the axis
        if(this.axis_length == null)
            return this.onXMLError("axis_length missing");

        this.log("Parsed Scene");
    }

    /**
    * Parses the <AMBIENT> block.
    */
    parseAmbient(ambientNode) {

        // ambient and background
        var children = ambientNode.children;
        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        // Treatment of the ambient component
        // Default values
        this.r = 0.1;
        this.g = 0.1;
        this.b = 0.1;
        this.a = 0.1;

        var indexAmbient = nodeNames.indexOf("ambient");
        if (indexAmbient == -1) {
            this.onXMLMinorError("Ambient component missing; assuming 'r = 0.1' 'g = 0.1' 'b = 0.1' 'a = 0.1'");
        }
        else {

            // r
            this.r = this.reader.getFloat(children[indexAmbient], 'r');
            if (!(this.r != null || !isNaN(this.r))) {
                this.r = 0.1;
                this.onXMLMinorError("unable to parse value for r; assuming 'r = 0.1'");
            }

            // g
            this.g = this.reader.getFloat(children[indexAmbient], 'g');
            if (!(this.g != null && !isNaN(this.g))) {
                this.g = 0.1;
                this.onXMLMinorError("unable to parse value for g; assuming 'g = 0.1'");
            }

            // b
            this.b = this.reader.getFloat(children[indexAmbient], 'b');
            if (!(this.b != null && !isNaN(this.b))) {
                this.b = 0.1;
                this.onXMLMinorError("unable to parse value for b; assuming 'b = 0.1'");
            }

            // a
            this.a = this.reader.getFloat(children[indexAmbient], 'a');
            if (!(this.a != null && !isNaN(this.a))) {
                this.a = 0.1;
                this.onXMLMinorError("unable to parse value for a; assuming 'a = 0.1'");
            }
        }
        this.ambientIllumination = [];
        this.ambientIllumination.push(this.r); 
        this.ambientIllumination.push(this.g); 
        this.ambientIllumination.push(this.b); 
        this.ambientIllumination.push(this.a);

        // Treatment of the background component
        // Default values
        this.r = 0.1;
        this.g = 0.1;
        this.b = 0.1;
        this.a = 0.1;

        var indexBackground = nodeNames.indexOf("background");
        if(indexBackground == -1){
            this.onXMLMinorError("Background component missing; assuming 'r = 0.1' 'g = 0.1' 'b = 0.1' 'a = 0.1'")
        }else{

            // r
            this.r = this.reader.getFloat(children[indexBackground], 'r');
            if (!(this.r != null && !isNaN(this.r))) {
                this.r = 0.1;
                this.onXMLMinorError("unable to parse value for r; assuming 'r = 0.1'");
            }

            // g
            this.g = this.reader.getFloat(children[indexBackground], 'g');
            if (!(this.g != null && !isNaN(this.g))) {
                this.g = 0.1;
                this.onXMLMinorError("unable to parse value for g; assuming 'g = 0.1'");
            }

            // b
            this.b = this.reader.getFloat(children[indexBackground], 'b');
            if (!(this.b != null && !isNaN(this.b))) {
                this.b = 0.1;
                this.onXMLMinorError("unable to parse value for b; assuming 'b = 0.1'");
            }

            // a
            this.a = this.reader.getFloat(children[indexBackground], 'a');
            if (!(this.a != null && !isNaN(this.a))) {
                this.a = 0.1;
                this.onXMLMinorError("unable to parse value for a; assuming 'a = 0.1'");
            }
        }
        this.background = [];
        this.background.push(this.r); 
        this.background.push(this.g); 
        this.background.push(this.b); 
        this.background.push(this.a);

        this.log("Parsed Ambient");
    }

    /**
     * Parses the <LIGHTS> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {

        // Omni or Spot
        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            // Checks if those are valid types of lights
            if (!(children[i].nodeName == "omni" || children[i].nodeName == "spot")) {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            // Light enable/disable
            var enableLight = true;
            var enable = this.reader.getString(children[i], 'enabled');
            if (enable == null) {
                this.onXMLMinorError("enable value missing for ID = " + lightId + "; assuming 'value = 1'");
            }
            else {
                enableLight = enable == 0 ? false : true;
            }
                
            //Initialization
            this.lights[lightId] = [];
            this.lights[lightId][0] = enableLight;
            this.lights[lightId][1] = [];
            this.lights[lightId][2] = [];
            this.lights[lightId][3] = [];
            this.lights[lightId][4] = [];
            this.lights[lightId][5] = [];
            this.lights[lightId][6] = [];

            // location, (target), ambient, diffuse, specular
            grandChildren = children[i].children;
            
            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            var locationIndex = nodeNames.indexOf("location");
            var ambientIndex = nodeNames.indexOf("ambient");
            var diffuseIndex = nodeNames.indexOf("diffuse");
            var specularIndex = nodeNames.indexOf("specular");

            // Retrieves the light location.
            if (locationIndex != -1) {

                // x
                var x = this.reader.getFloat(grandChildren[locationIndex], 'x');
                if (!(x != null && !isNaN(x)))
                    return "unable to parse x-coordinate of the light location for ID = " + lightId;
                else
                    this.lights[lightId][1].push(x);

                // y
                var y = this.reader.getFloat(grandChildren[locationIndex], 'y');
                if (!(y != null && !isNaN(y)))
                    return "unable to parse y-coordinate of the light location for ID = " + lightId;
                else
                    this.lights[lightId][1].push(y);

                // z
                var z = this.reader.getFloat(grandChildren[locationIndex], 'z');
                if (!(z != null && !isNaN(z)))
                    return "unable to parse z-coordinate of the light location for ID = " + lightId;
                else
                    this.lights[lightId][1].push(z);

                // w
                var w = this.reader.getFloat(grandChildren[locationIndex], 'w');
                if (!(w != null && !isNaN(w) && w >= 0 && w <= 1))
                    return "unable to parse w-coordinate of the light location for ID = " + lightId;
                else
                    this.lights[lightId][1].push(w);
            }
            else
                return "light location undefined for ID = " + lightId;


            // Retrieves the ambient component.
            if (ambientIndex != -1) {

                // r
                var r = this.reader.getFloat(grandChildren[ambientIndex], 'r');
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "unable to parse R component of the ambient illumination for ID = " + lightId;
                else
                    this.lights[lightId][2].push(r);

                // g
                var g = this.reader.getFloat(grandChildren[ambientIndex], 'g');
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "unable to parse G component of the ambient illumination for ID = " + lightId;
                else
                    this.lights[lightId][2].push(g);

                // b
                var b = this.reader.getFloat(grandChildren[ambientIndex], 'b');
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "unable to parse B component of the ambient illumination for ID = " + lightId;
                else
                    this.lights[lightId][2].push(b);

                // a
                var a = this.reader.getFloat(grandChildren[ambientIndex], 'a');
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "unable to parse A component of the ambient illumination for ID = " + lightId;
                else
                    this.lights[lightId][2].push(a);
            }
            else
                return "ambient component undefined for ID = " + lightId;


            // Retrieves the diffuse component
            if (diffuseIndex != -1) {

                // r
                var r = this.reader.getFloat(grandChildren[diffuseIndex], 'r');
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "unable to parse R component of the difuse illumination for ID = " + lightId;
                else
                    this.lights[lightId][3].push(r);

                // g
                var g = this.reader.getFloat(grandChildren[diffuseIndex], 'g');
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "unable to parse G component of the difuse illumination for ID = " + lightId;
                else
                    this.lights[lightId][3].push(g);

                // b
                var b = this.reader.getFloat(grandChildren[diffuseIndex], 'b');
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "unable to parse B component of the difuse illumination for ID = " + lightId;
                else
                    this.lights[lightId][3].push(b);

                // a
                var a = this.reader.getFloat(grandChildren[diffuseIndex], 'a');
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "unable to parse A component of the difuse illumination for ID = " + lightId;
                else
                    this.lights[lightId][3].push(a);
            }
            else
                return "difuse component undefined for ID = " + lightId;


            // Retrieves the specular component
            if (specularIndex != -1) {

                // r
                var r = this.reader.getFloat(grandChildren[specularIndex], 'r');
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "unable to parse R component of the specular illumination for ID = " + lightId;
                else
                    this.lights[lightId][4].push(r);

                // g
                var g = this.reader.getFloat(grandChildren[specularIndex], 'g');
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "unable to parse G component of the specular illumination for ID = " + lightId;
                else
                    this.lights[lightId][4].push(g);

                // b
                var b = this.reader.getFloat(grandChildren[specularIndex], 'b');
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "unable to parse B component of the specular illumination for ID = " + lightId;
                else
                    this.lights[lightId][4].push(b);

                // a
                var a = this.reader.getFloat(grandChildren[specularIndex], 'a');
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "unable to parse A component of the specular illumination for ID = " + lightId;
                else
                    this.lights[lightId][4].push(a);

            }
            else
                return "specular component undefined for ID = " + lightId;

            // Spot lights has an angle and exponent
            if(children[i].nodeName == "spot"){

                var angle = this.reader.getFloat(children[i], 'angle');
                var exponent = this.reader.getFloat(children[i], 'exponent');
                var targetIndex = nodeNames.indexOf("target");

                this.lights[lightId][5].push(angle);
                this.lights[lightId][5].push(exponent);

                if (targetIndex != -1) {

                    // x
                    var x = this.reader.getFloat(grandChildren[targetIndex], 'x');
                    if (!(x != null && !isNaN(x)))
                        return "unable to parse x-coordinate of the light target for ID = " + lightId;
                    else
                        this.lights[lightId][6].push(x);

                    // y
                    var y = this.reader.getFloat(grandChildren[targetIndex], 'y');
                    if (!(y != null && !isNaN(y)))
                        return "unable to parse y-coordinate of the light target for ID = " + lightId;
                    else
                        this.lights[lightId][6].push(y);

                    // z
                    var z = this.reader.getFloat(grandChildren[targetIndex], 'z');
                    if (!(z != null && !isNaN(z)))
                        return "unable to parse z-coordinate of the light target for ID = " + lightId;
                    else
                        this.lights[lightId][6].push(z);;
                }
                else
                    return "light target undefined for ID = " + lightId;
            }

            numLights++;
        }

        if (numLights == 0)
            return "At least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("Too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed Lights");

        return null;
    }   

    /**
     * Parses the <PRIMITIVES> node.
     * @param {primitives block element} primitivesNode
     */
    parsePrimitives(primitivesNode) {

        // Primitive
        var children = primitivesNode.children;

        // Any number of primitives
        for(var i = 0; i < children.length; i++){

            // Checks if the primitive has an ID
            var primitiveId = this.reader.getString(children[i], 'id');
            if(primitiveId == null)
                 this.onXMLError("No ID defined for primitive");

            // Rectangle or triangle or cylinder or sphere or torus
            var grandChildren = children[i].children;

            // Retrieves the rectangle specifications
            if(grandChildren[0].nodeName == "rectangle"){          

                // x1
                var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                if (!(x1 != null && !isNaN(x1))){
                    this.onXMLMinorError("Unable to parse first x1-coordinate of the rectangle for ID = " + primitiveId + "Assuming x1 = -0.5");
                    x1 = -0.5;
                }
                
                // y1
                var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                if (!(y1 != null && !isNaN(y1))){
                    this.onXMLMinorError("Unable to parse first y1-coordinate of the rectangle for ID = " + primitiveId + "Assuming y1 = -0.5");
                    y1 = -0.5;
                }
                
                // x2
                var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                if (!(x2 != null && !isNaN(x2))){
                    this.onXMLMinorError("Unable to parse first x2-coordinate of the rectangle for ID = " + primitiveId + "Assuming x2 = 0.5");
                    x2 = 0.5;
                }
                
                // y2
                var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if (!(y2 != null && !isNaN(y2))){
                    this.onXMLMinorError("Unable to parse first y2-coordinate of the rectangle for ID = " + primitiveId + "Assuming y2 = 0.5");
                    y2 = 0.5
                }

                // Places this rectangle in the Primitive's Map
                var newPrimitive = new MyRectangle(this.scene, x1, x2, y1, y2);
                primitiveMap.set(primitiveId, newPrimitive);
            } 
            // Retrieves the triangle specifications
            else if(grandChildren[0].nodeName == "triangle"){           

                // x1
                var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                if (!(x1 != null && !isNaN(x1))){
                    this.onXMLMinorError("Unable to parse first x1-coordinate of the triangle for ID = " + primitiveId + "Assuming x1 = 0.0");
                    x1 = 0.0;
                }
                // y1
                var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                if (!(y1 != null && !isNaN(y1))){
                    this.onXMLMinorError("Unable to parse first y1-coordinate of the rectangle for ID = " + primitiveId + "Assuming y1 = 0.0");
                    y1 = 0.0;
                }
                // z1
                var z1 = this.reader.getFloat(grandChildren[0], 'z1');
                if (!(z1 != null && !isNaN(z1))){
                    this.onXMLMinorError("Unable to parse first z1-coordinate of the rectangle for ID = " + primitiveId + "Assuming z1 = 0.0");
                    z1 = 0.0;
                }
                // x2
                var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                if (!(x2 != null && !isNaN(x2))){
                    this.onXMLMinorError("Unable to parse first x2-coordinate of the rectangle for ID = " + primitiveId + "Assuming x2 = 0.0");
                    x2 = 0.0;
                }
                // y2
                var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if (!(y2 != null && !isNaN(y2))){
                    this.onXMLMinorError("Unable to parse first y2-coordinate of the rectangle for ID = " + primitiveId + "Assuming y2 = -1.0");
                    y2 = -1.0;
                }
                // z2
                var z2 = this.reader.getFloat(grandChildren[0], 'z2');
                if (!(z2 != null && !isNaN(z2))){
                    this.onXMLMinorError("Unable to parse first z2-coordinate of the rectangle for ID = " + primitiveId + "Assuming z2 = 0.0");
                    z2 = 0.0;
                }
                // x3
                var x3 = this.reader.getFloat(grandChildren[0], 'x3');
                if (!(x3 != null && !isNaN(x3))){
                    this.onXMLMinorError("Unable to parse first x3-coordinate of the rectangle for ID = " + primitiveId + "Assuming x3 = 0.0");
                    x3 = 0.0;
                }
                // y3
                var y3 = this.reader.getFloat(grandChildren[0], 'y3');
                if (!(y3 != null && !isNaN(y3))){
                    this.onXMLMinorError("Unable to parse first y3-coordinate of the rectangle for ID = " + primitiveId + "Assuming y3 = 0.0");
                    y3 = 0.0;
                }
                // z1
                var z3 = this.reader.getFloat(grandChildren[0], 'z3');
                if (!(z3 != null && !isNaN(z3))){
                    this.onXMLMinorError("Unable to parse first z3-coordinate of the rectangle for ID = " + primitiveId + "Assuming z3 = 0.0");
                    z3 = 1.0;
                }

                // Places this triangle in the Primitive's Map
                var newPrimitive = new MyTriangle(this.scene, x1, x2, x3, y1, y2, y3, z1, z2, z3);
                primitiveMap.set(primitiveId, newPrimitive);
            } 
            // Retrieves the cylinder specifications
            else if(grandChildren[0].nodeName == "cylinder"){

                // base
                var base = this.reader.getFloat(grandChildren[0], 'base');
                if (!(base != null && !isNaN(base))){
                    this.onXMLMinorError("Unable to parse base of the cylinder for ID = " + primitiveId + "Assuming base = 1.0");
                    base = 1.0;
                }
                
                // top
                var top = this.reader.getFloat(grandChildren[0], 'top');
                if (!(top != null && !isNaN(top))){
                    this.onXMLMinorError("Unable to parse top of the cylinder for ID = " + primitiveId + "Assuming top = 1.0");
                    top = 1.0;
                }
                // height
                var height = this.reader.getFloat(grandChildren[0], 'height');
                if (!(height != null && !isNaN(height))){
                    this.onXMLMinorError("Unable to parse height of the cylinder for ID = " + primitiveId + "Assuming height = 1.0");
                    height = 1.0;
                }
                // slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices))){
                    this.onXMLMinorError("Unable to parse slices of the cylinder for ID = " + primitiveId + "Assuming slices = 20");
                    slices = 20.0;
                }
                // stacks
                var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks))){
                    this.onXMLMinorError("Unable to parse stacks of the cylinder for ID = " + primitiveId + "Assuming stacks = 20");
                    stacks = 20.0;
                }

                // Places this cylinder in the Primitive's Map
                var newPrimitive = new MyCylinder(this.scene, base, top, height, slices, stacks);
                primitiveMap.set(primitiveId, newPrimitive);
            } 
            // Retrieves the sphere specifications
            else if(grandChildren[0].nodeName == "sphere"){
            
                // radius
                var radius = this.reader.getFloat(grandChildren[0], 'radius');
                if (!(radius != null && !isNaN(radius))){
                    this.onXMLMinorError("Unable to parse radius of the sphere for ID = " + primitiveId + "Assuming radius = 1.0");
                    radius = 1.0;
                }
                // slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices))){
                    this.onXMLMinorError("Unable to parse slices of the sphere for ID = " + primitiveId + "Assuming slices = 20");
                    slices = 1.0;
                }
                // stacks
                var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks))){
                    this.onXMLMinorError("Unable to parse stacks of the sphere for ID = " + primitiveId + "Assuming stacks = 20");
                    stacks = 1.0;
                }

                // Places this sphere in the Primitive's Map
                var newPrimitive = new MySphere(this.scene, radius, slices, stacks);
                primitiveMap.set(primitiveId, newPrimitive);

            } 
            // Retrieves the torus specifications
            else if(grandChildren[0].nodeName == "torus"){

                // inner
                var inner = this.reader.getFloat(grandChildren[0], 'inner');
                if (!(inner != null && !isNaN(inner))){
                    this.onXMLMinorError("Unable to parse inner of the torus for ID = " + primitiveId + "Assuming inner = 4.0");
                    inner = 4.0;
                }  
                // outer
                var outer = this.reader.getFloat(grandChildren[0], 'outer');
                if (!(outer != null && !isNaN(outer))){
                    this.onXMLMinorError("Unable to parse outer of the torus for ID = " + primitiveId + "Assuming outer = 5.0");
                    outer = 5.0;
                } 
                // slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices))){
                    this.onXMLMinorError("Unable to parse slices of the torus for ID = " + primitiveId + "Assuming slices = 20");
                    slices = 20;
                } 
                // loops
                var loops = this.reader.getFloat(grandChildren[0], 'loops');
                if (!(loops != null && !isNaN(loops))){
                    this.onXMLMinorError("Unable to parse loops of the torus for ID = " + primitiveId + "Assuming loops = 20");
                    loops = 20;
                } 

                // Places this torus in the Primitive's Map
                var newPrimitive = new MyTorus(this.scene, inner, outer, slices, loops);
                primitiveMap.set(primitiveId, newPrimitive);
            }
            //Retrieving the project2 specifications
            else if(grandChildren[0].nodeName == "plane"){

                this.plane = [];
                // npartsU
                var npartsU = this.reader.getFloat(grandChildren[0], 'npartsU');
                if (!(npartsU != null && !isNaN(npartsU))){
                    this.onXMLMinorError("Unable to parse npartsU of the plane for ID = " + primitiveId + "Assuming npartsU = 10");
                    npartsU = 10;
                } 
                // npartsV
                var npartsV = this.reader.getFloat(grandChildren[0], 'npartsV');
                if (!(npartsU != null && !isNaN(npartsV))){
                    this.onXMLMinorError("Unable to parse npartsV of the plane for ID = " + primitiveId + "Assuming npartsV = 10");
                    npartsV = 10;
                }
                this.plane.push(npartsU, npartsV);


                this.patch = [];
                if(grandChildren[1].nodeName == "patch"){

                    // npointsU
                    var npointsU = this.reader.getFloat(grandChildren[1], 'npointsU');
                    if (!(npointsU != null && !isNaN(npointsU))){
                        this.onXMLMinorError("Unable to parse npointsU of the patch for ID = " + primitiveId + "Assuming npointsU = 1.0");
                        npointsU = 1.0;
                    }
                    // npointsV
                    var npointsV = this.reader.getFloat(grandChildren[1], 'npointsV');
                    if (!(npointsV != null && !isNaN(npointsV))){
                        this.onXMLMinorError("Unable to parse npointsV of the patch for ID = " + primitiveId + "Assuming npointsV = 1.0");
                        npointsV = 1.0;
                    }
                    // npartsU
                    var npartsU = this.reader.getFloat(grandChildren[1], 'npartsU');
                    if (!(npartsU != null && !isNaN(npartsU))){
                        this.onXMLMinorError("Unable to parse npartsU of the patch for ID = " + primitiveId + "Assuming npartsU = 5.0");
                        npartsU = 5.0;
                    }
                    // npartsV
                    var npartsV = this.reader.getFloat(grandChildren[1], 'npartsV');
                    if (!(npartsV != null && !isNaN(npartsV))){
                        this.onXMLMinorError("Unable to parse npartsV of the patch for ID = " + primitiveId + "Assuming npartsV = 5.0");
                        npartsV = 5.0;
                    }
                
                    // controlpoint
                    var grandgrandChildren = grandChildren[1].children;

                    
                    this.controlpoints = [];
                    // Any number of controlpoints
                    for(var k = 0; k < grandgrandChildren.length; k++){

                        // x
                        var x = this.reader.getFloat(grandgrandChildren[k], 'x');
                        if (!(x != null && !isNaN(x))){
                            this.onXMLMinorError("Unable to parse x of the patch for ID = " + primitiveId + "Assuming x = 5.0");
                            x = 5.0;
                        }
                        // y
                        var y = this.reader.getFloat(grandgrandChildren[k], 'y');
                        if (!(y != null && !isNaN(y))){
                            this.onXMLMinorError("Unable to parse y of the patch for ID = " + primitiveId + "Assuming y = 0.0");
                            y = 0.0;
                        }
                        // z
                        var z = this.reader.getFloat(grandgrandChildren[k], 'z');
                        if (!(z != null && !isNaN(z))){
                            this.onXMLMinorError("Unable to parse z of the patch for ID = " + primitiveId + "Assuming z = 5.0");
                            z = 5.0;
                        }

                        this.controlpoints.push(x, y, z);
                    }

                    this.patch.push(npointsU, npointsV, npartsU, npartsV, this.controlpoints);
                }

                this.vehicle = [];
                this.vehicle.push("vehicles");
                if(grandChildren[2].nodeName == "vehicle"){

                    console.log("vehicle");
                }

                this.cylinder2 = [];
                if(grandChildren[3].nodeName == "cylinder2"){

                    // base
                    var base = this.reader.getFloat(grandChildren[3], 'base');
                    if (!(base != null && !isNaN(base))){
                        this.onXMLMinorError("Unable to parse base of the cylinder2 for ID = " + primitiveId + "Assuming base = 2.5");
                        base = 2.5;
                    }
                
                    // top
                    var top = this.reader.getFloat(grandChildren[3], 'top');
                    if (!(top != null && !isNaN(top))){
                        this.onXMLMinorError("Unable to parse top of the cylinder2 for ID = " + primitiveId + "Assuming top = 2.5");
                        top = 2.5;
                    }
                    // height
                    var height = this.reader.getFloat(grandChildren[3], 'height');
                    if (!(height != null && !isNaN(height))){
                        this.onXMLMinorError("Unable to parse height of the cylinder2 for ID = " + primitiveId + "Assuming height = 5.0");
                        height = 5.0;
                    }
                    // slices
                    var slices = this.reader.getFloat(grandChildren[3], 'slices');
                    if (!(slices != null && !isNaN(slices))){
                        this.onXMLMinorError("Unable to parse slices of the cylinder2 for ID = " + primitiveId + "Assuming slices = 20");
                        slices = 20.0;
                    }
                    // stacks
                    var stacks = this.reader.getFloat(grandChildren[3], 'stacks');
                    if (!(stacks != null && !isNaN(stacks))){
                        this.onXMLMinorError("Unable to parse stacks of the cylinder2 for ID = " + primitiveId + "Assuming stacks = 20");
                        stacks = 20.0;
                    }

                    this.cylinder2.push(base, top, height, slices, stacks);
                }

                this.terrain = [];
                if(grandChildren[4].nodeName == "terrain"){

                    // idtexture
                    var idtexture = this.reader.getString(grandChildren[4], 'idtexture');
                    if (idtexture == null){
                        this.onXMLMinorError("Unable to parse idtexture of the terrain for ID = " + primitiveId + "Assuming idtexture = wood");
                        idtexture = "wood";
                    }
                    // idheightmap
                    var idheightmap = this.reader.getString(grandChildren[4], 'idheightmap');
                    if (idheightmap == null){
                        this.onXMLMinorError("Unable to parse idheightmap of the terrain for ID = " + primitiveId + "Assuming idheightmap = wood");
                        idheightmap = "wood";
                    }
                    // parts
                    var parts = this.reader.getFloat(grandChildren[4], 'parts');
                    if (!(parts != null && !isNaN(parts))){
                        this.onXMLMinorError("Unable to parse parts of the terrain for ID = " + primitiveId + "Assuming parts = 5.0");
                        parts = 5.0;
                    }
                    // heightscale
                    var heightscale = this.reader.getFloat(grandChildren[4], 'heightscale');
                    if (!(heightscale != null && !isNaN(heightscale))){
                        this.onXMLMinorError("Unable to parse heightscale of the terrain for ID = " + primitiveId + "Assuming heightscale = 5.0");
                        heightscale = 5.0;
                    }

                    this.terrain.push(idtexture, idheightmap, parts, heightscale);
                }

                this.water = [];
                if(grandChildren[5].nodeName == "water"){
                    
                    // idtexture
                    var idtexture = this.reader.getString(grandChildren[5], 'idtexture');
                    if (idtexture == null){
                        this.onXMLMinorError("Unable to parse idtexture of the water for ID = " + primitiveId + "Assuming idtexture = water");
                        idtexture = "water";
                    }
                    // idwavemap
                    var idwavemap = this.reader.getString(grandChildren[5], 'idwavemap');
                    if (idwavemap == null){
                        this.onXMLMinorError("Unable to parse idwavemap of the water for ID = " + primitiveId + "Assuming idwavemap = waves");
                        idwavemap = "waves";
                    }
                    // parts
                    var parts = this.reader.getFloat(grandChildren[5], 'parts');
                    if (!(parts != null && !isNaN(parts))){
                        this.onXMLMinorError("Unable to parse parts of the water for ID = " + primitiveId + "Assuming parts = 5.0");
                        parts = 5.0;
                    }
                    // heightscale
                    var heightscale = this.reader.getFloat(grandChildren[5], 'heightscale');
                    if (!(heightscale != null && !isNaN(heightscale))){
                        this.onXMLMinorError("Unable to parse heightscale of the water for ID = " + primitiveId + "Assuming heightscale = 0.25");
                        heightscale = 0.25;
                    }
                    // texscale
                    var texscale = this.reader.getFloat(grandChildren[5], 'texscale');
                    if (!(texscale != null && !isNaN(parts))){
                        this.onXMLMinorError("Unable to parse texscale of the water for ID = " + primitiveId + "Assuming texscale = 0.25");
                    texscale = 0.25;
                    }

                    this.water.push(idtexture, idwavemap, parts, heightscale, texscale);
                }

                else{
                     this.onXMLMinorError("Error in the plane primitive.");
                }

                // Places this plane in the Primitive's Map
                var newPrimitive = new MyPlane(this.scene, this.plane, this.patch, this.vehicle, this.cylinder2, this.terrain, this.water);
                primitiveMap.set(primitiveId, newPrimitive);
            }
            else
                return "primitive undefined for ID = " + primitiveId;

        }

        this.log("Parsed Primitives");

        return null;
    }

    /**
     * Parses the <TEXTURES> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode){

        // texture
        var children = texturesNode.children;

        // Any number of textures
        for(var i = 0; i < children.length; i++){

            var tID = this.reader.getString(children[i], 'id');
            var path = this.reader.getString(children[i], 'file');

            // Checks if there the texture ID and/or path exist
            if(tID == null){
                this.onXMLError("ID not defined");
            }else if(path == null){
                this.onXMLMinorError("No path defined for texture ID = " + tID);
            }else if(tID != null && path != null){

                var newText = new CGFtexture(this.scene, path);        
                textureMap.set(tID, newText);

            }
        }
        this.log("Parsed Textures");
    }

    /**
     * Parses the <TRANSFORMATIONS> node.
     * @param {transformations block element} transformationsNode
     */

    parseTransformations(transformationsNode) {

        // transformation
        var children = transformationsNode.children;

        // Any number of transformations
        for(var i = 0; i < children.length; i++){

            // Get id of the current transformations
            var transformationId = this.reader.getString(children[i], 'id');

            if(transformationId == null)
                return "no ID defined for transformation";

            //translate or rotate or scale
            var grandChildren = children[i].children;
            
            // Scenes matrix becomes an identity matrix
            this.scene.loadIdentity();

            // Any number of translates or rotates or scales in each transformation
            for(var j = 0; j < grandChildren.length; j++){
            
            // Retrieves the translation components
                if(grandChildren[j].nodeName == "translate"){

                    // x
                    var x = this.reader.getFloat(grandChildren[j], 'x');
                    if (!(x != null && !isNaN(x)))
                        return "unable to parse x component of the translation for ID = " + transformationId;
                    // y
                    var y = this.reader.getFloat(grandChildren[j], 'y');
                    if (!(y != null && !isNaN(y)))
                        return "unable to parse y component of the translation for ID = " + transformationId;
                    // z
                    var z = this.reader.getFloat(grandChildren[j], 'z');
                    if (!(z != null && !isNaN(z)))
                        return "unable to parse z component of the translation for ID = " + transformationId;  
                    //Matrix
                    this.scene.translate(x, y, z);
                }    

                // Retrieves the rotation components
                else if(grandChildren[j].nodeName == "rotate"){
                    // axis
                    var axis = this.reader.getString(grandChildren[j], 'axis');
                    if (axis == null)
                        return "unable to parse the axis of the rotation for ID = " + transformationId;
                    // angle
                    var angle = this.reader.getFloat(grandChildren[j], 'angle');
                    if (!(angle != null && !isNaN(angle)))
                        return "unable to parse angle component of the rotation for ID = " + transformationId;
                    //Matrix
                    if(axis == "x"){
                        this.scene.rotate(angle*DEGREE_TO_RAD, 1, 0, 0);

                    }else if(axis == "y"){
                        this.scene.rotate(angle*DEGREE_TO_RAD, 0, 1, 0);

                    }else if(axis == "z"){
                        this.scene.rotate(angle*DEGREE_TO_RAD, 0, 0, 1)
                    }
                }

                // Retrieves the scale components
                else if(grandChildren[j].nodeName == "scale"){
                    // x
                    var x = this.reader.getFloat(grandChildren[j], 'x');
                    if (!(x != null && !isNaN(x)))
                        return "unable to parse x component of the scale for ID = " + transformationId;
                    // y
                    var y = this.reader.getFloat(grandChildren[j], 'y');
                    if (!(y != null && !isNaN(y)))
                        return "unable to parse y component of the scale for ID = " + transformationId;
                    // z
                    var z = this.reader.getFloat(grandChildren[j], 'z');
                    if (!(z != null && !isNaN(z)))
                        return "unable to parse z component of the scale for ID = " + transformationId;
                    
                    //Matrix
                    this.scene.scale(x, y, z);
                }
            }
            transformMap.set(transformationId, this.scene.getMatrix());
        }
        this.log("Parsed Transformations");
        return null;
    }

    /**
     * Parses the <MATERIALS> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode){
       
        // material
        var children = materialsNode.children; 

        // Any number of materials
        for(var i = 0; i < children.length; i++){

            var materials = null;

            var materialID = this.reader.getString(children[i], 'id');
            var shininess = this.reader.getFloat(children[i], 'shininess');

            if(materialID == null)
                this.onXMLError("Error, ID missing for a material");

            if(shininess == null){
                this.onXMLMinorError("Shininess missing, assuming Shininess = 120");
                shininess = 120;
            }

            // Creates a new material
            var newMaterial = new CGFappearance(this.scene);
            // Sets the new material shininess
            newMaterial.setShininess(shininess);

            // emission, ambient, diffuse, specular
            var grandchildren = children[i].children;
            var nodesName = [];

            for(var j = 0; j < grandchildren.length; j++)
                nodesName.push(grandchildren[j].nodeName);

            var emissionIndex = nodesName.indexOf("emission");
            var ambientIndex = nodesName.indexOf("ambient");
            var diffuseIndex = nodesName.indexOf("diffuse");
            var specularIndex = nodesName.indexOf("specular");


            // Emission default values
            this.r = 0.1; this.g = 0.1; this.b = 0.1; this.a = 0.1;

            if(emissionIndex == -1){
                this.onXMLMinorError("Emission component missing. Assuming default values");
            }else{

                // r
                this.r = this.reader.getFloat(grandchildren[emissionIndex], 'r');
                if (!(this.r != null || !isNaN(this.r))) {
                    this.r = 0.1;
                    this.onXMLMinorError("unable to parse value for r; assuming 'r = 0.1'");
                }

                // g
                this.g = this.reader.getFloat(grandchildren[emissionIndex], 'g');
                if (!(this.g != null && !isNaN(this.g))) {
                    this.g = 0.1;
                    this.onXMLMinorError("unable to parse value for g; assuming 'g = 0.1'");
                }

                // b
                this.b = this.reader.getFloat(grandchildren[emissionIndex], 'b');
                if (!(this.b != null && !isNaN(this.b))) {
                    this.b = 0.1;
                    this.onXMLMinorError("unable to parse value for b; assuming 'b = 0.1'");
                }

                // a
                this.a = this.reader.getFloat(grandchildren[emissionIndex], 'a');
                if (!(this.a != null && !isNaN(this.a))) {
                    this.a = 0.1;
                    this.onXMLMinorError("unable to parse value for a; assuming 'a = 0.1'");
                }
            }
            // Sets the new emission values
            newMaterial.setEmission(this.r, this.g, this.b, this.a);


            // Ambient default values
            this.r = 0.1; this.g = 0.1; this.b = 0.1; this.a = 0.1;

            if(ambientIndex == -1){
                this.onXMLMinorError("ambient component missing. Assuming default values");
            }else{

                // r
                this.r = this.reader.getFloat(grandchildren[ambientIndex], 'r');
                if (!(this.r != null || !isNaN(this.r))) {
                    this.r = 0.1;
                    this.onXMLMinorError("unable to parse value for r; assuming 'r = 0.1'");
                }

                // g
                this.g = this.reader.getFloat(grandchildren[ambientIndex], 'g');
                if (!(this.g != null && !isNaN(this.g))) {
                    this.g = 0.1;
                    this.onXMLMinorError("unable to parse value for g; assuming 'g = 0.1'");
                }

                // b
                this.b = this.reader.getFloat(grandchildren[ambientIndex], 'b');
                if (!(this.b != null && !isNaN(this.b))) {
                    this.b = 0.1;
                    this.onXMLMinorError("unable to parse value for b; assuming 'b = 0.1'");
                }

                // a
                this.a = this.reader.getFloat(grandchildren[ambientIndex], 'a');
                if (!(this.a != null && !isNaN(this.a))) {
                    this.a = 0.1;
                    this.onXMLMinorError("unable to parse value for a; assuming 'a = 0.1'");
                }
            }
            // Sets the new ambient values
            newMaterial.setAmbient(this.r, this.g, this.b, this.a);


            // Diffuse default values
            this.r = 0.1; this.g = 0.1; this.b = 0.1; this.a = 0.1;

            if(diffuseIndex == -1){
                this.onXMLMinorError("diffuse component missing. Assuming default values");
            }else{

                // r
                this.r = this.reader.getFloat(grandchildren[diffuseIndex], 'r');
                if (!(this.r != null || !isNaN(this.r))) {
                    this.r = 0.1;
                    this.onXMLMinorError("unable to parse value for r; assuming 'r = 0.1'");
                }

                // g
                this.g = this.reader.getFloat(grandchildren[diffuseIndex], 'g');
                if (!(this.g != null && !isNaN(this.g))) {
                    this.g = 0.1;
                    this.onXMLMinorError("unable to parse value for g; assuming 'g = 0.1'");
                }

                // b
                this.b = this.reader.getFloat(grandchildren[diffuseIndex], 'b');
                if (!(this.b != null && !isNaN(this.b))) {
                    this.b = 0.1;
                    this.onXMLMinorError("unable to parse value for b; assuming 'b = 0.1'");
                }

                // a
                this.a = this.reader.getFloat(grandchildren[diffuseIndex], 'a');
                if (!(this.a != null && !isNaN(this.a))) {
                    this.a = 0.1;
                    this.onXMLMinorError("unable to parse value for a; assuming 'a = 0.1'");
                }
            }
            // Sets the new diffuse values
            newMaterial.setDiffuse(this.r, this.g, this.b, this.a);


            // Specular default values
            this.r = 0.1; this.g = 0.1; this.b = 0.1; this.a = 0.1;

            if(specularIndex == -1){
                this.onXMLMinorError("specular component missing. Assuming default values");
            }else{

                // r
                this.r = this.reader.getFloat(grandchildren[specularIndex], 'r');
                if (!(this.r != null || !isNaN(this.r))) {
                    this.r = 0.1;
                    this.onXMLMinorError("unable to parse value for r; assuming 'r = 0.1'");
                }

                // g
                this.g = this.reader.getFloat(grandchildren[specularIndex], 'g');
                if (!(this.g != null && !isNaN(this.g))) {
                    this.g = 0.1;
                    this.onXMLMinorError("unable to parse value for g; assuming 'g = 0.1'");
                }

                // b
                this.b = this.reader.getFloat(grandchildren[specularIndex], 'b');
                if (!(this.b != null && !isNaN(this.b))) {
                    this.b = 0.1;
                    this.onXMLMinorError("unable to parse value for b; assuming 'b = 0.1'");
                }

                // a
                this.a = this.reader.getFloat(grandchildren[specularIndex], 'a');
                if (!(this.a != null && !isNaN(this.a))) {
                    this.a = 0.1;
                    this.onXMLMinorError("unable to parse value for a; assuming 'a = 0.1'");
                }
            }
            // Sets the new specular values
            newMaterial.setSpecular(this.r, this.g, this.b, this.a);

            materials = newMaterial;
            materialMap.set(materialID, materials);
        }
        this.log("Parsed Materials");
        
        return null;
    }


    /**
     * Parses the <ANIMATIONS> node.
     * @param {animations block element} animationsNode
     */
    parseAnimations(animationsNode){

        // linear or circular
        var children = animationsNode.children;

        // Any number of animations
        for(var i = 0; i < children.length; i++){

            // Checks if it is a valid ID
            var ID = this.reader.getString(children[i], 'id');
            if(ID == null)
                this.onXMLError("ID missing");

            // Checks if it is a valid span
            var span = this.reader.getFloat(children[i], 'span');
            if (!(span != null && !isNaN(span))) {
                this.onXMLMinorError("unable to parse span; assuming 'span = 10.0'");
                span = 10.0;
            }

            // linear
            if(children[i].nodeName == "linear"){

                // point
                var grandchildren = children[i].children;

                // Array of arrays that has all the control points
                var points = [];

                // Any number of control points
                for(var k = 0; k < grandchildren.length; k++){

                    // Array that has each control point
                    var auxPoints = [];

                    // x
                    var x = this.reader.getFloat(grandchildren[k], 'x');
                    if (!(x != null && !isNaN(x))) {
                        this.onXMLMinorError("unable to parse x; assuming 'x = 0.0'");
                        x = 0.0;
                    }

                    // y
                    var y = this.reader.getFloat(grandchildren[k], 'y');
                    if (!(y != null && !isNaN(y))) {
                        this.onXMLMinorError("unable to parse y; assuming 'y = 0.0'");
                        y = 0.0;
                    }

                    // z
                    var z = this.reader.getFloat(grandchildren[k], 'z');
                    if (!(z != null && !isNaN(z))) {
                        this.onXMLMinorError("unable to parse z; assuming 'z = 0.0'");
                        z = 0.0;
                    }

                    auxPoints.push(x, y, z);
                    points.push(auxPoints);
                }

                var newLinear = new LinearAnimation(this, span, points);
                animationsMap.set(ID, newLinear);
            }
            // circular
            else if(children[i].nodeName == "circular"){

                // Checks if it is a valid radius
                var radius = this.reader.getFloat(children[i], 'radius');
                if (!(radius != null && !isNaN(radius))) {
                    this.onXMLMinorError("unable to parse radius; assuming 'radius = 5.0'");
                    radius = 5.0;
                }

                // center and angle
                var x; var y; var z;
                var centerArray;
                var center = this.reader.getString(children[i], 'center');

                if(center == null){
                    this.onXMLMinorError("unable to parse center; assuming 'x = 5; y = 5; z = 5'");
                    x = 5.0; 
                    y = 5.0;
                    z = 5.0;
                    centerArray.push(x);
                    centerArray.push(y);
                    centerArray.push(z);
                }else{
                    centerArray = center.split(' ');
                    centerArray[0] = parseFloat(centerArray[0]);
                    centerArray[1] = parseFloat(centerArray[1]);
                    centerArray[2] = parseFloat(centerArray[2]);
                }

                // Arrays that will hold the center coordinates and the values of the angles
                var angle = [];

                // angle init
                var startang = this.reader.getFloat(children[i], 'startang');
                if (!(startang != null && !isNaN(startang))) {
                    this.onXMLMinorError("unable to parse startang; assuming 'startang = 0.0'");
                    startang = 0.0;
                }

                // angle rot
                var rotang = this.reader.getFloat(children[i], 'rotang');
                if (!(rotang != null && !isNaN(rotang))) {
                    this.onXMLMinorError("unable to parse rotang; assuming 'rotang = 360.0'");
                    rotang = 360.0;
                }

                angle.push(startang, rotang);

                var newCircular = new CircularAnimation(this, span, radius, centerArray, angle);
                animationsMap.set(ID, newCircular);
            }
        }
        this.log("Parsed Animations");

        return null;
    }


    /**
    *Parses the <VIEWS> block
    *@param {views block element} viewsNode
    */
    parseViews(viewsNode){

        // perspective or ortho
        var children = viewsNode.children;
        this.defaultView = this.reader.getString(viewsNode, 'default');

        // Any number of views
        for(var i = 0; i < children.length; i++){

            // Checks if it is a valid ID
            var ID = this.reader.getString(children[i], 'id');
            if(ID == null)
                this.onXMLError("ID missing");

            this.currentView.push(ID);

            // Checks if it is a valid value for near
            var near = this.reader.getFloat(children[i], 'near');
            if (!(near != null && !isNaN(near))) {
                this.onXMLMinorError("unable to parse value for near; assuming 'near = 0.1'");
                near = 0.1;
            }  
                
            // Checks if it is a valid value for near
            var far = this.reader.getFloat(children[i], 'far');
            if (!(far != null && !isNaN(far))) {
                this.onXMLMinorError("unable to parse value for far; assuming 'far = 500'");
                far = 500;
            }

            // from or to
            var grandchildren = children[i].children;
            var nodesName = [];

            for(var j = 0; j < grandchildren.length; j++)
                nodesName.push(grandchildren[j].nodeName);

            var fromIndex = nodesName.indexOf("from");
            var toIndex = nodesName.indexOf("to");

            // x from
            var xf = this.reader.getFloat(grandchildren[fromIndex], 'x');
            if (!(xf != null && !isNaN(xf))) {
                xf = 20;
                this.onXMLMinorError("unable to parse value for xf on From; assuming 'xf = 20'");
            }

            // y from
            var yf = this.reader.getFloat(grandchildren[fromIndex], 'y');
            if (!(yf != null && !isNaN(yf))) {
                yf = 20;
                this.onXMLMinorError("unable to parse value for yf on From; assuming 'yf = 20'");
            }

            // z from
            var zf = this.reader.getFloat(grandchildren[fromIndex], 'z');
            if (!(zf != null && !isNaN(zf))) {
                zf = 20;
                this.onXMLMinorError("unable to parse value for zf on From; assuming 'zf = 20'");
            }

            // x to
            var xt = this.reader.getFloat(grandchildren[toIndex], 'x');
            if (!(xt != null && !isNaN(xt))) {
                xt = 10;
                this.onXMLMinorError("unable to parse value for xt on To; assuming 'xt = 10'");
            }

            // y to
            var yt = this.reader.getFloat(grandchildren[toIndex], 'y');
            if (!(yt != null && !isNaN(yt))) {
                yt = 10;
                this.onXMLMinorError("unable to parse value for yt on To; assuming 'yt = 10'");
            }

            // z to
            var zt = this.reader.getFloat(grandchildren[toIndex], 'z');
            if (!(zt != null && !isNaN(zt))) {
                zt = 10;
                this.onXMLMinorError("unable to parse value for zt on To; assuming 'zt = 10'");
            }

            // View Perspective type has an angle
            if(children[i].nodeName == "perspective"){
                
                // angle
                var angle = this.reader.getFloat(children[i], 'angle');
                if (!(angle != null && !isNaN(angle))) {
                    angle = 50;
                    this.onXMLMinorError("unable to parse value for angle; assuming 'angle = 50'");
                }

                var newPcamera = new CGFcamera(angle*DEGREE_TO_RAD, near, far, vec3.fromValues(xf, yf, zf), vec3.fromValues(xt, yt, zt));
                this.viewMap.set(ID, newPcamera);
                
            }

            // View Perspective type has a left, right, top and bottom
            if(children[i].nodeName == "ortho"){

                // left
                var left = this.reader.getFloat(children[i], 'left');
                if (!(left != null && !isNaN(left))) {
                    left = -15;
                    this.onXMLMinorError("unable to parse value for left; assuming 'left = -15'");
                }

                // right
                var right = this.reader.getFloat(children[i], 'right');
                if (!(right != null && !isNaN(right))) {
                    right = 15;
                    this.onXMLMinorError("unable to parse value for right; assuming 'right = 15'");
                }

                // top
                var top = this.reader.getFloat(children[i], 'top');
                if (!(top != null && !isNaN(top))) {
                    top = 15;
                    this.onXMLMinorError("unable to parse value for top; assuming 'top = 15'");
                }

                // bottom
                var bottom = this.reader.getFloat(children[i], 'bottom');
                if (!(bottom != null && !isNaN(bottom))) {
                    bottom = 0.4;
                    this.onXMLMinorError("unable to parse value for bottom; assuming 'left = -15'");
                }

                var newOcamera = new CGFcameraOrtho(left, right, bottom, top, near, far, vec3.fromValues(xf, yf, zf), vec3.fromValues(xt, yt, zt), vec3.fromValues(0,1,0));
                this.viewMap.set(ID, newOcamera);

            }
        }
        this.log("Parsed Views");
    }

    /**
    *Parses the <COMPONENTS> block
    *@param {views components element} componentsNode
    */
    parseComponents(componentsNode){

    // component
    var children = componentsNode.children;
    var nodes = [];

    // Any number of components
    for(let i = 0; i < children.length; i++){

        // Checks if it a valid ID
        var componentId = this.reader.getString(children[i], "id");
        if (componentId == null) {   
            this.onXMLError("unable to parse value for componentId");
        }
        

        var transformationrefs = null;
        var material;
        var textures = [];  // order: [textID, length_s, length_t, ...]
        var primitives = [];
        var components = [];
        var animations = [];

        // transformation, materials, texture and children
        var grandchildren = children[i].children;

        var extraT = mat4.create();

        for(let k = 0; k < grandchildren.length; k++){

            // transformations
            if(grandchildren[k].nodeName == "transformation"){

                // transformationref, translate, rotate, or scale
                var grandgrandchildren = grandchildren[k].children;

                if(grandgrandchildren.length != 0){

                    // Any number of transformations
                    for(var j = 0; j < grandgrandchildren.length; j++){
   
                            // transformationref
                            if(grandgrandchildren[j].nodeName == "transformationref"){
                                    var transformationId = this.reader.getString(grandgrandchildren[0], "id");
                                    if(transformationId == null)
                                        onXMLError("No ID defined for transformation");
                                    transformationrefs = transformationId;
                            }

                            // translate
                            else if(grandgrandchildren[j].nodeName == "translate"){
                               
                                // x
                                var x = this.reader.getFloat(grandgrandchildren[j], 'x');
                                if (!(x != null && !isNaN(x))){
                                    this.onXMLMinorError("Unable to parse x component of the translation, assuming x = 0.0");
                                    x = 0.0;
                                }

                                // y
                                var y = this.reader.getFloat(grandgrandchildren[j], 'y');
                                if (!(y != null && !isNaN(y))){
                                    this.onXMLMinorError("Unable to parse y component of the translation, assuming y = 0.0");
                                    y = 0.0;
                                }
                                
                                // z
                                var z = this.reader.getFloat(grandgrandchildren[j], 'z');
                                if (!(z != null && !isNaN(z))){
                                    this.onXMLMinorError("Unable to parse z component of the translation, assuming z = 0.0");
                                    z = 0.0;
                                }  

                                //Matrix
                                mat4.translate(extraT, extraT, [x,y,z]);
                            }
                            // rotate
                            else if(grandgrandchildren[j].nodeName == "rotate"){

                                //axis
                                var axis = this.reader.getString(grandgrandchildren[j], 'axis');
                                if (axis == null){
                                    onXMLError("Unable to parse axis");
                                }

                                // angle
                                var angle = this.reader.getFloat(grandgrandchildren[j], 'angle');
                                if (!(angle != null && !isNaN(angle))){
                                    onXMLMinorError("Unable to parse angle, assuming angle = 0.0");
                                    angle = 0.0;
                                }

                                // Matrix
                                if(axis == "x"){
                                    mat4.rotateX(extraT, extraT, angle*DEGREE_TO_RAD);

                                }else if(axis == "y"){
                                    mat4.rotateY(extraT, extraT, angle*DEGREE_TO_RAD);

                                }else if(axis == "z"){
                                    mat4.rotateZ(extraT, extraT, angle*DEGREE_TO_RAD)
                                }
                            }
                            // scale
                            else if(grandgrandchildren[j].nodeName == "scale"){
                                
                                // x
                                var x = this.reader.getFloat(grandgrandchildren[j], 'x');
                                if (!(x != null && !isNaN(x))){
                                    onXMLMinorError("Unable to parse x component of the scale, assuming x = 1.0");
                                    x = 1.0;
                                }

                                // y
                                var y = this.reader.getFloat(grandgrandchildren[j], 'y');
                                if (!(y != null && !isNaN(y))){
                                    onXMLMinorError("Unable to parse y component of the scale, assuming y = 1.0");
                                    y = 1.0;
                                }

                                // z
                                var z = this.reader.getFloat(grandgrandchildren[j], 'z');
                                if (!(z != null && !isNaN(z))){
                                    onXMLMinorError("Unable to parse z component of the scale, assuming z = 1.0");
                                    z = 1.0;
                                }
                            
                            // Matrix
                            mat4.scale(extraT, extraT, [x, y, z]);
                        }
                    }
                }
            }

            // materials
            if(grandchildren[k].nodeName == "materials"){

                var material = [];

                // material
                var grandgrandchildren = grandchildren[k].children;

                // Any number of materials
                for(var m = 0; m < grandgrandchildren.length; m++){

                    var materials = this.reader.getString(grandgrandchildren[m], "id");

                    if(materials == null)
                        onXMLError("Unable to parse the material ID, assuming default material");
                    else
                        material.push(materials);
                }
                
            }

            // textures
            if(grandchildren[k].nodeName == "texture"){

                // ID
                var textID = this.reader.getString(grandchildren[k], "id");
                if(textID == null){
                    onXMLError("Unable to parse the texture, assuming default texture");
                }

                // length_s
                var length_s = this.reader.getFloat(grandchildren[k], "length_s");
                if (!(length_s != null && !isNaN(length_s))){
                    this.onXMLMinorError("Unable to parse length_s, assuming length_s = 1.0");
                    length_s = 1.0;
                } 

                // length_t
                var length_t = this.reader.getFloat(grandchildren[k], "length_t");
                if (!(length_t != null && !isNaN(length_t))){
                    this.onXMLMinorError("Unable to parse length_t, assuming length_t = 1.0");
                    length_t = 1.0;
                } 
                textures.push(textID, length_s, length_t);
            }

            // animations
            if(grandchildren[k].nodeName == "animations"){
                
                // animation
                var grandgrandchildren = grandchildren[k].children;

                // Any number of animations
                for(var m = 0; m < grandgrandchildren.length; m++){

                    var animationID = this.reader.getString(grandgrandchildren[m], "id");

                    if(animationID == null)
                        onXMLError("Unable to parse the animation ID");
                    else
                        animations.push(animationID);
                }
                
            }

            // children
            if(grandchildren[k].nodeName == "children"){

                // primitiveref and/or componentref
                var grandgrandchildren = grandchildren[k].children;

                // Any number of primitiveref and/or componentref
                for(var z = 0; z < grandgrandchildren.length; z++){

                    // primitiveref
                    if(grandgrandchildren[z].nodeName == "primitiveref"){
                        
                        // id
                        var primitiveID = this.reader.getString(grandgrandchildren[z], "id");
                        if(primitiveID == null){
                            onXMLError("Primitive ID missing");
                        }
                        primitives.push(primitiveID);
                    }

                    // componentref
                    else { 

                        // id
                        var componentID = this.reader.getString(grandgrandchildren[z], "id");
                        if(componentID == null){
                            onXMLError("Component ID missing");
                        }
                        components.push(componentID);
                    }
                }
            }
        }

        // Creates a new node and places it in the nodes array
        var node = new MyGraphNode(componentId, material, textures, transformationrefs, components, primitives,  mat4.clone(extraT), animations);
        this.nodes.push(node);
    }

    // Any number of nodes in the graph. It is used so we do not have the problem of creating nodes which have children nodes
    // that have not yet been created
    for(var i = 0; i < this.nodes.length; i++){

        var new_components = this.nodes[i].components;
        this.nodes[i].components = [];

        for(var k = 0; k < new_components.length; k++){

            for(var j = 0; j < this.nodes.length; j++){

                if(this.nodes[j].ID == new_components[k]){

                    this.nodes[i].components.push(this.nodes[j]);
                }
            }
        }
    }

    this.log("Parsed Components");
    return null;
    }



    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }


    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Finds the the root node for the start of the display.
     */
    displayScene() {
        
        // Searches for the root node
        var root_node;
        for(var i = 0; i < this.nodes.length; i++){

            // Checks if the current node's ID is equal to the root's ID
            if(this.nodes[i].ID == this.root){
                root_node = this.nodes[i];
                break;
            }
        }

        // Default texture, material, length_s and length_t
        var default_text = null;
        var default_mat = null;
        var default_S = null;
        var default_T = null;

        // Calls the recursive function that displays the objects
        this.recursiveDisplayNode(root_node, default_text, default_mat, default_S, default_T);
    }

    /**
     * Displays the scene, processing each node, starting in the root node. It's recursive
     */
    recursiveDisplayNode(node, textIni, matIni, iniS, iniT){
        
        var material = matIni;
        var texture = textIni;
        var length_s = iniS;
        var length_t = iniT;

        var index = this.counterMaterial % node.material.length;

        // Changes the material if the component does not inherit it from its parent
        if(node.material[index] != "inherit")
            material = node.material[index];

        // Changes the texture if the component does not inherit it from its parent
        if(node.texture[0] != "inherit"){

            texture = node.texture[0];

            if(node.texture[1] != "null" && node.texture[2] != "null")

                length_s = node.texture[1];
                length_t = node.texture[2];
        }

        // Case where there is no texture
        if(texture != null)
            materialMap.get(material).setTexture(textureMap.get(texture));
        
        // Applies the material
        materialMap.get(material).apply();

        // Applies the node's transformations (componentref)
        if(node.transformations != null)
           this.scene.multMatrix(transformMap.get(node.transformations));

       // Applies the node's transformations (translate, scale or rotate)
        if(node.extraTransf != null)
            this.scene.multMatrix(node.extraTransf);

        // Recursively takes care of the the node's children
        for(var i = 0; i < node.components.length; i++){

            this.scene.pushMatrix();           
            
                this.recursiveDisplayNode(node.components[i], texture, material, length_s, length_t);

            this.scene.popMatrix();
        }

        // Displays all the primitives of the node
        for(var i = 0; i < node.primitives.length; i++){
            
            if(texture != null)
                primitiveMap.get(node.primitives[i]).updateTex(length_s, length_t);
      
            primitiveMap.get(node.primitives[i]).display();
        }
    }

}