var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var PRIMITIVES_INDEX = 7;
var COMPONENTS_INDEX = 8;

var transformMap = new Map();
var materialMap = new Map();
var textureMap = new Map();

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
        this.primitiveArray = [];

        this.rectangle = null;
        this.triangle = null;
        this.cylinder = null;
        this.sphere = null;
        this.torus = null;

        this.idRoot = null;                    

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */

        this.reader.open('scenes/' + filename, this);

        this.viewMap = new Map();
        this.defaultView = null;
        
        this.currentView = [];
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

        // <ambient>
        if((index =nodeNames.indexOf("ambient")) == -1)
            return this.onXMLError("tag <ambient> missing");
        else{
            if(index != AMBIENT_INDEX)
                this.onXMLMinorError("tag <ambient> out of order");
            //PARSE AMBIENT BLOCK
            if((error = this.parseAmbient(nodes[index])) != null)
                return error;
        }

        // <views>
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

        // <Transformations>
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return this.onXMLError("tag <transformations> missing");
        else {
            if (index != TRANSFORMATIONS_INDEX)
                this.onXMLMinorError("tag <transformations> out of order");

            //Parse NODES block
            if ((error = this.parseTransformations(nodes[index])) != null)
                return error;
        }

        //<Primitives>
        if((index = nodeNames.indexOf("primitives")) == -1)
            return this.onXMLError("tag <Primitives> missing");
        else{
            if(index != PRIMITIVES_INDEX)
                this.onXMLMinorError("tag <primitives> out of order");
            
            //Parse PRIMITIVES block 
            if((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }

        //<Components>
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

        if(this.axis_length == null)
            return this.onXMLError("axis_length missing");

        this.log("Parsed Scene");
    }

    /**
    * Parses the <AMBIENT> block.
    */
    parseAmbient(ambientNode) {

        var children = ambientNode.children;
        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        //ambient 
        //default values
        this.r = 0.1;
        this.g = 0.1;
        this.b = 0.1;
        this.a = 0.1;

        var indexAmbient = nodeNames.indexOf("ambient");
        if (indexAmbient == -1) {
            this.onXMLMinorError("Ambient component missing; assuming 'r = 0.1' 'g = 0.1' 'b = 0.1' 'a = 0.1'");
        }
        else {
            this.r = this.reader.getFloat(children[indexAmbient], 'r');
            this.g = this.reader.getFloat(children[indexAmbient], 'g');
            this.b = this.reader.getFloat(children[indexAmbient], 'b');
            this.a = this.reader.getFloat(children[indexAmbient], 'a');

            if (!(this.r != null || !isNaN(this.r))) {
                this.r = 0.1;
                this.onXMLMinorError("unable to parse value for r; assuming 'r = 0.1'");
            }
            if (!(this.g != null && !isNaN(this.g))) {
                this.g = 0.1;
                this.onXMLMinorError("unable to parse value for g; assuming 'g = 0.1'");
            }

            if (!(this.b != null && !isNaN(this.b))) {
                this.b = 0.1;
                this.onXMLMinorError("unable to parse value for b; assuming 'b = 0.1'");
            }

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

        //background
        //default values

        this.r = 0.1;
        this.g = 0.1;
        this.b = 0.1;
        this.a = 0.1;

        var indexBackground = nodeNames.indexOf("background");
        if(indexBackground == -1){
            this.onXMLMinorError("Background component missing; assuming 'r = 0.1' 'g = 0.1' 'b = 0.1' 'a = 0.1'")
        }else{
            this.r = this.reader.getFloat(children[indexBackground], 'r');
            this.g = this.reader.getFloat(children[indexBackground], 'g');
            this.b = this.reader.getFloat(children[indexBackground], 'b');
            this.a = this.reader.getFloat(children[indexBackground], 'a');

            if (!(this.r != null && !isNaN(this.r))) {
                this.r = 0.1;
                this.onXMLMinorError("unable to parse value for r; assuming 'r = 0.1'");
            }
            if (!(this.g != null && !isNaN(this.g))) {
                this.g = 0.1;
                this.onXMLMinorError("unable to parse value for g; assuming 'g = 0.1'");
            }

            if (!(this.b != null && !isNaN(this.b))) {
                this.b = 0.1;
                this.onXMLMinorError("unable to parse value for b; assuming 'b = 0.1'");
            }

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
            var enableIndex = this.reader.getString(children[i], 'enabled');
            if (enableIndex == -1) {
                this.onXMLMinorError("enable value missing for ID = " + lightId + "; assuming 'value = 1'");
            }
            else {
                enableLight = enableIndex == 0 ? false : true;
            }
                
            //Initialization
            this.lights[lightId] = [];
            this.lights[lightId][0] = enableLight;
            this.lights[lightId][1] = [];
            this.lights[lightId][2] = [];
            this.lights[lightId][3] = [];
            this.lights[lightId][4] = [];
            grandChildren = children[i].children;
            
            // Specifications for the current light.
            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            // Gets indices of each element for both types of lights.
            var locationIndex = nodeNames.indexOf("location");
            var ambientIndex = nodeNames.indexOf("ambient");
            var diffuseIndex = nodeNames.indexOf("diffuse");
            var specularIndex = nodeNames.indexOf("specular");

            // Retrieves "spot" lights extra components
            var angles = [];
            var exponents = [];
            if(children[i].nodeName == "spot"){

                // Gets indices of each element for the "spot" type of light.
                var angleIndex = this.reader.getString(children[i], 'angle');
                var exponentIndex = this.reader.getString(children[i], 'exponent');

                // Light angle
                if (angleIndex != -1) {

                    if (!(angleIndex != null && !isNaN(angleIndex) && angleIndex >= 0 && angleIndex <= 1))
                        return "unable to parse the angle for ID = " + lightId;
                    else
                        angles.push(angleIndex);
                }
                else
                    return "angle undefined for ID = " + lightId;

                // Light exponent
                if (exponentIndex != -1) {

                    if (!(exponentIndex != null && !isNaN(exponentIndex) && exponentIndex >= 0 && exponentIndex <= 1))
                        return "unable to parse the exponent for ID = " + lightId;
                    else
                        exponents.push(exponentIndex);
                }
                else
                    return "exponent undefined for ID = " + lightId;
            }


            // Retrieves the light location.
            var locationLight = [];
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
            var ambientIllumination = [];
            if (ambientIndex != -1) {
                // R
                var r = this.reader.getFloat(grandChildren[ambientIndex], 'r');
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "unable to parse R component of the ambient illumination for ID = " + lightId;
                else
                    this.lights[lightId][2].push(r);

                // G
                var g = this.reader.getFloat(grandChildren[ambientIndex], 'g');
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "unable to parse G component of the ambient illumination for ID = " + lightId;
                else
                    this.lights[lightId][2].push(g);

                // B
                var b = this.reader.getFloat(grandChildren[ambientIndex], 'b');
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "unable to parse B component of the ambient illumination for ID = " + lightId;
                else
                    this.lights[lightId][2].push(b);

                // A
                var a = this.reader.getFloat(grandChildren[ambientIndex], 'a');
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "unable to parse A component of the ambient illumination for ID = " + lightId;
                else
                    this.lights[lightId][2].push(a);
            }
            else
                return "ambient component undefined for ID = " + lightId;


            // Retrieves the diffuse component
            var diffuseIllumination = [];
            if (diffuseIndex != -1) {

                // R
                var r = this.reader.getFloat(grandChildren[diffuseIndex], 'r');
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "unable to parse R component of the difuse illumination for ID = " + lightId;
                else
                    this.lights[lightId][3].push(r);

                // G
                var g = this.reader.getFloat(grandChildren[diffuseIndex], 'g');
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "unable to parse G component of the difuse illumination for ID = " + lightId;
                else
                    this.lights[lightId][3].push(g);

                // B
                var b = this.reader.getFloat(grandChildren[diffuseIndex], 'b');
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "unable to parse B component of the difuse illumination for ID = " + lightId;
                else
                    this.lights[lightId][3].push(b);

                // A
                var a = this.reader.getFloat(grandChildren[diffuseIndex], 'a');
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "unable to parse A component of the difuse illumination for ID = " + lightId;
                else
                    this.lights[lightId][3].push(a);
            }
            else
                return "difuse component undefined for ID = " + lightId;


            // Retrieves the specular component
            var specularIllumination = [];
            if (specularIndex != -1) {

                // R
                var r = this.reader.getFloat(grandChildren[specularIndex], 'r');
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "unable to parse R component of the specular illumination for ID = " + lightId;
                else
                    this.lights[lightId][4].push(r);

                // G
                var g = this.reader.getFloat(grandChildren[specularIndex], 'g');
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "unable to parse G component of the specular illumination for ID = " + lightId;
                else
                    this.lights[lightId][4].push(g);

                // B
                var b = this.reader.getFloat(grandChildren[specularIndex], 'b');
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "unable to parse B component of the specular illumination for ID = " + lightId;
                else
                    this.lights[lightId][4].push(b);

                // A
                var a = this.reader.getFloat(grandChildren[specularIndex], 'a');
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "unable to parse A component of the specular illumination for ID = " + lightId;
                else
                    this.lights[lightId][4].push(a);

            }
            else
                return "specular component undefined for ID = " + lightId;

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

        var children = primitivesNode.children;

        for(var i = 0; i < children.length; i++){

            var primitiveId = this.reader.getString(children[i], 'id');
            if(primitiveId == null)
                return "No ID defined for primitive";

            var grandChildren = children[i].children;

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

                this.primitiveArray[primitiveId] = new MyRectangle(this.scene, x1, x2, y1, y2);
                //console.log(this.primitiveArray[primitiveId]);
                //this.primitiveArray[primitiveId].updateTex(0.5, 0.5);

            } 
            else if(grandChildren[0].nodeName == "triangle"){             // Retrieves the triangle specifications

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

                this.primitiveArray[primitiveId] = new MyTriangle(this.scene, x1, x2, x3, y1, y2, y3, z1, z2, z3);
            } 
            else if(grandChildren[0].nodeName == "cylinder"){            // Retrieves the cylinder specifications

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
                    slices = 1.0;
                }
                // stacks
                var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks))){
                    this.onXMLMinorError("Unable to parse stacks of the cylinder for ID = " + primitiveId + "Assuming stacks = 20");
                    stacks = 1.0;
                }

                this.primitiveArray[primitiveId] = new MyCylinder(this.scene, base, top, height, slices, stacks);
            } 
            else if(grandChildren[0].nodeName == "sphere"){            // Retrieves the sphere specifications
            
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

                this.primitiveArray[primitiveId] = new MySphere(this.scene, radius, slices, stacks);

            } 
            else if(grandChildren[0].nodeName == "torus"){            // Retrieves the torus specifications

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

                this.primitiveArray[primitiveId] = new MyTorus(this.scene, inner, outer, slices, loops);
            } 
            else
                return "primitive undefined for ID = " + primitiveId;

        }

        console.log("Parsed Primitives");

        return null;
    }

    /**
     * Parses the <TEXTURES> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode){

        var children = texturesNode.children;

        for(var i = 0; i < children.length; i++){

            var tID = this.reader.getString(children[i], 'id');
            var path = this.reader.getString(children[i], 'file');

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

        var children = transformationsNode.children;

        // Any number of transformations
        for(var i = 0; i < children.length; i++){

            // Get id of the current transformations
            var transformationId = this.reader.getString(children[i], 'id');

            if(transformationId == null)
                return "no ID defined for transformation";

            var grandChildren = children[i].children;
               
            this.scene.loadIdentity();

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
                    //Matriz
                    this.scene.translate(x, y, z);
                }    

                // Retrieves the rotation components
                if(grandChildren[j].nodeName == "rotate"){
                    // axis
                    var axis = this.reader.getString(grandChildren[j], 'axis');
                    if (axis == null)
                        return "unable to parse the axis of the rotation for ID = " + transformationId;
                    // angle
                    var angle = this.reader.getFloat(grandChildren[j], 'angle');
                    if (!(angle != null && !isNaN(angle)))
                        return "unable to parse angle component of the rotation for ID = " + transformationId;
                    //Matriz
                    if(axis == "x"){
                        this.scene.rotate(angle*DEGREE_TO_RAD, 1, 0, 0);

                    }else if(axis == "y"){
                        this.scene.rotate(angle*DEGREE_TO_RAD, 0, 1, 0);

                    }else if(axis == "z"){
                        this.scene.rotate(angle*DEGREE_TO_RAD, 0, 0, 1)
                    }
                }
                // Retrieves the scale components
                if(grandChildren[j].nodeName == "scale"){
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
                    
                    this.scene.scale(x, y, z);
                }
            }
            transformMap.set(transformationId, this.scene.getMatrix());
        }
        console.log("Parsed Transformations");
        return null;
    }

    /**
     * Parses the <MATERIALS> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode){
       
        var children = materialsNode.children; 

        for(var i = 0; i < children.length; i++){

            var materials = null;

            var materialID = this.reader.getString(children[i], 'id');
            var shininess = this.reader.getFloat(children[i], 'shininess');

            if(materialID == null)
                return "Error, ID missing for a material";

            if(shininess == null){
                this.onXMLMinorError("Shininess missing, assuming Shininess = 120");
                shininess = 120;
            }

            var newMaterial = new CGFappearance(this.scene);

            newMaterial.setShininess(shininess);

            var grandchildren = children[i].children;
            var nodesName = [];

            for(var j = 0; j < grandchildren.length; j++)
                nodesName.push(grandchildren[j].nodeName);

            var emissionIndex = nodesName.indexOf("emission");
            var ambientIndex = nodesName.indexOf("ambient");
            var diffuseIndex = nodesName.indexOf("diffuse");
            var specularIndex = nodesName.indexOf("specular");

            this.r = 0.1; this.g = 0.1; this.b = 0.1; this.a = 0.1;

            if(emissionIndex == -1){
                this.onXMLMinorError("Emission component missing. Assuming default values");
            }else{
                this.r = this.reader.getFloat(grandchildren[emissionIndex], 'r');
                this.g = this.reader.getFloat(grandchildren[emissionIndex], 'g');
                this.b = this.reader.getFloat(grandchildren[emissionIndex], 'b');
                this.a = this.reader.getFloat(grandchildren[emissionIndex], 'a');
               
                if (!(this.r != null || !isNaN(this.r))) {
                    this.r = 0.1;
                    this.onXMLMinorError("unable to parse value for r; assuming 'r = 0.1'");
                }
                if (!(this.g != null && !isNaN(this.g))) {
                    this.g = 0.1;
                    this.onXMLMinorError("unable to parse value for g; assuming 'g = 0.1'");
                }

                if (!(this.b != null && !isNaN(this.b))) {
                    this.b = 0.1;
                    this.onXMLMinorError("unable to parse value for b; assuming 'b = 0.1'");
                }

                if (!(this.a != null && !isNaN(this.a))) {
                    this.a = 0.1;
                    this.onXMLMinorError("unable to parse value for a; assuming 'a = 0.1'");
                }
            }
            
            newMaterial.setEmission(this.r, this.g, this.b, this.a);

            this.r = 0.1; this.g = 0.1; this.b = 0.1; this.a = 0.1;

            if(ambientIndex == -1){
                this.onXMLMinorError("ambient component missing. Assuming default values");
            }else{
                this.r = this.reader.getFloat(grandchildren[ambientIndex], 'r');
                this.g = this.reader.getFloat(grandchildren[ambientIndex], 'g');
                this.b = this.reader.getFloat(grandchildren[ambientIndex], 'b');
                this.a = this.reader.getFloat(grandchildren[ambientIndex], 'a');

                if (!(this.r != null || !isNaN(this.r))) {
                    this.r = 0.1;
                    this.onXMLMinorError("unable to parse value for r; assuming 'r = 0.1'");
                }
                if (!(this.g != null && !isNaN(this.g))) {
                    this.g = 0.1;
                    this.onXMLMinorError("unable to parse value for g; assuming 'g = 0.1'");
                }

                if (!(this.b != null && !isNaN(this.b))) {
                    this.b = 0.1;
                    this.onXMLMinorError("unable to parse value for b; assuming 'b = 0.1'");
                }

                if (!(this.a != null && !isNaN(this.a))) {
                    this.a = 0.1;
                    this.onXMLMinorError("unable to parse value for a; assuming 'a = 0.1'");
                }
            }
            
            newMaterial.setAmbient(this.r, this.g, this.b, this.a);

            this.r = 0.1; this.g = 0.1; this.b = 0.1; this.a = 0.1;

            if(diffuseIndex == -1){
                this.onXMLMinorError("diffuse component missing. Assuming default values");
            }else{
                this.r = this.reader.getFloat(grandchildren[diffuseIndex], 'r');
                this.g = this.reader.getFloat(grandchildren[diffuseIndex], 'g');
                this.b = this.reader.getFloat(grandchildren[diffuseIndex], 'b');
                this.a = this.reader.getFloat(grandchildren[diffuseIndex], 'a');

                if (!(this.r != null || !isNaN(this.r))) {
                    this.r = 0.1;
                    this.onXMLMinorError("unable to parse value for r; assuming 'r = 0.1'");
                }
                if (!(this.g != null && !isNaN(this.g))) {
                    this.g = 0.1;
                    this.onXMLMinorError("unable to parse value for g; assuming 'g = 0.1'");
                }

                if (!(this.b != null && !isNaN(this.b))) {
                    this.b = 0.1;
                    this.onXMLMinorError("unable to parse value for b; assuming 'b = 0.1'");
                }

                if (!(this.a != null && !isNaN(this.a))) {
                    this.a = 0.1;
                    this.onXMLMinorError("unable to parse value for a; assuming 'a = 0.1'");
                }
            }
            
            newMaterial.setDiffuse(this.r, this.g, this.b, this.a);

            this.r = 0.1; this.g = 0.1; this.b = 0.1; this.a = 0.1;

            if(specularIndex == -1){
                this.onXMLMinorError("specular component missing. Assuming default values");
            }else{
                this.r = this.reader.getFloat(grandchildren[specularIndex], 'r');
                this.g = this.reader.getFloat(grandchildren[specularIndex], 'g');
                this.b = this.reader.getFloat(grandchildren[specularIndex], 'b');
                this.a = this.reader.getFloat(grandchildren[specularIndex], 'a');

                if (!(this.r != null || !isNaN(this.r))) {
                    this.r = 0.1;
                    this.onXMLMinorError("unable to parse value for r; assuming 'r = 0.1'");
                }
                if (!(this.g != null && !isNaN(this.g))) {
                    this.g = 0.1;
                    this.onXMLMinorError("unable to parse value for g; assuming 'g = 0.1'");
                }

                if (!(this.b != null && !isNaN(this.b))) {
                    this.b = 0.1;
                    this.onXMLMinorError("unable to parse value for b; assuming 'b = 0.1'");
                }

                if (!(this.a != null && !isNaN(this.a))) {
                    this.a = 0.1;
                    this.onXMLMinorError("unable to parse value for a; assuming 'a = 0.1'");
                }
            }
            newMaterial.setSpecular(this.r, this.g, this.b, this.a);

            materials = newMaterial;
            materialMap.set(materialID, materials);


        }
        this.log("Parsed Materials");
        
        return null;
    }

    /**
    *Parses the <VIEWS> block
    *@param {views block element} viewsNode
    */
    parseViews(viewsNode){//Preparei tudo para colocar num array mas precisamos de mudar para aceitar ambas as views
        var children = viewsNode.children;
        this.defaultView = this.reader.getString(viewsNode, 'default');

        for(var i = 0; i < children.length; i++){

            var ID = this.reader.getString(children[i], 'id');
            if(ID == null)
                this.onXMLError("ID missing");

            this.currentView.push(ID);

            var near = this.reader.getFloat(children[i], 'near');
            if (!(near != null && !isNaN(near))) {
                this.onXMLMinorError("unable to parse value for near; assuming 'near = 0.1'");
                near = 0.1;
            }  
                
            var far = this.reader.getFloat(children[i], 'far');
            if (!(far != null && !isNaN(far))) {
                this.onXMLMinorError("unable to parse value for far; assuming 'far = 500'");
                far = 500;
            }

            var grandchildren = children[i].children;
            var nodesName = [];

            for(var j = 0; j < grandchildren.length; j++)
                nodesName.push(grandchildren[j].nodeName);

            var fromIndex = nodesName.indexOf("from");
            var toIndex = nodesName.indexOf("to");

            var xf = this.reader.getFloat(grandchildren[fromIndex], 'x');
            if (!(xf != null && !isNaN(xf))) {
                xf = 20;
                this.onXMLMinorError("unable to parse value for xf on From; assuming 'xf = 20'");
            }

            var yf = this.reader.getFloat(grandchildren[fromIndex], 'y');
            if (!(yf != null && !isNaN(yf))) {
                yf = 20;
                this.onXMLMinorError("unable to parse value for yf on From; assuming 'yf = 20'");
            }

            var zf = this.reader.getFloat(grandchildren[fromIndex], 'z');
            if (!(zf != null && !isNaN(zf))) {
                zf = 20;
                this.onXMLMinorError("unable to parse value for zf on From; assuming 'zf = 20'");
            }


            var xt = this.reader.getFloat(grandchildren[toIndex], 'x');
            if (!(xt != null && !isNaN(xt))) {
                xt = 10;
                this.onXMLMinorError("unable to parse value for xt on To; assuming 'xt = 10'");
            }

            var yt = this.reader.getFloat(grandchildren[toIndex], 'y');
            if (!(yt != null && !isNaN(yt))) {
                yt = 10;
                this.onXMLMinorError("unable to parse value for yt on To; assuming 'yt = 10'");
            }

            var zt = this.reader.getFloat(grandchildren[toIndex], 'z');
            if (!(zt != null && !isNaN(zt))) {
                zt = 10;
                this.onXMLMinorError("unable to parse value for zt on To; assuming 'zt = 10'");
            }

            if(children[i].nodeName == "perspective"){
                
                var angle = this.reader.getFloat(children[i], 'angle');
                if (!(angle != null && !isNaN(angle))) {
                    angle = 0.4;
                    this.onXMLMinorError("unable to parse value for angle; assuming 'angle = 0.4'");
                }

                var newPcamera = new CGFcamera(angle, near, far, vec3.fromValues(xf, yf, zf), vec3.fromValues(xt, yt, zt));
                this.viewMap.set(ID, newPcamera);
                
            }

            if(children[i].nodeName == "ortho"){

                var left = this.reader.getFloat(children[i], 'left');
                if (!(left != null && !isNaN(left))) {
                    left = -15;
                    this.onXMLMinorError("unable to parse value for left; assuming 'left = -15'");
                }
                var right = this.reader.getFloat(children[i], 'right');
                if (!(right != null && !isNaN(right))) {
                    right = 15;
                    this.onXMLMinorError("unable to parse value for right; assuming 'right = 15'");
                }
                var top = this.reader.getFloat(children[i], 'top');
                if (!(top != null && !isNaN(top))) {
                    top = 15;
                    this.onXMLMinorError("unable to parse value for top; assuming 'top = 15'");
                }
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

    var children = componentsNode.children;
    var nodes = [];

    for(let i = 0; i < children.length; i++){

        var componentId = this.reader.getString(children[i], "id");
        if (componentId == null) {   
            this.onXMLError("unable to parse value for componentId");
        }
        

        var transformationrefs = null;
        var material;
        var textures = [];  // order: [textID, length_s, length_t, ...]
        var primitives = [];
        var components = [];

        var grandchildren = children[i].children;

        var extraT = mat4.create();

        for(let k = 0; k < grandchildren.length; k++){

            if(grandchildren[k].nodeName == "transformation"){

                var grandgrandchildren = grandchildren[k].children;

                if(grandgrandchildren.length != 0){

                    for(var j = 0; j < grandgrandchildren.length; j++){
   
                            if(grandgrandchildren[j].nodeName == "transformationref"){
                                    var transformationId = this.reader.getString(grandgrandchildren[0], "id");
                                    if(transformationId == null)
                                        onXMLError("No ID defined for transformation");
                                    transformationrefs = transformationId;
                            }

                            else if(grandgrandchildren[j].nodeName == "translate"){
                               
                                var x = this.reader.getFloat(grandgrandchildren[j], 'x');
                                if (!(x != null && !isNaN(x))){
                                    this.onXMLMinorError("Unable to parse x component of the translation, assuming x = 0.0");
                                    x = 0.0;
                                }

                                var y = this.reader.getFloat(grandgrandchildren[j], 'y');
                                if (!(y != null && !isNaN(y))){
                                    this.onXMLMinorError("Unable to parse y component of the translation, assuming y = 0.0");
                                    y = 0.0;
                                }
                                
                                var z = this.reader.getFloat(grandgrandchildren[j], 'z');
                                if (!(z != null && !isNaN(z))){
                                    this.onXMLMinorError("Unable to parse z component of the translation, assuming z = 0.0");
                                    z = 0.0;
                                }  

                                //Matriz
                                mat4.translate(extraT, extraT, [x,y,z]);
                                
                            }

                            else if(grandgrandchildren[j].nodeName == "rotate"){
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
                                //Matriz
                                if(axis == "x"){
                                    mat4.rotateX(extraT, extraT, angle*DEGREE_TO_RAD);

                                }else if(axis == "y"){
                                    mat4.rotateY(extraT, extraT, angle*DEGREE_TO_RAD);

                                }else if(axis == "z"){
                                    mat4.rotateZ(extraT, extraT, angle*DEGREE_TO_RAD)
                                }
                            }

                            else if(grandgrandchildren[j].nodeName == "scale"){
                                
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
                    
                            mat4.scale(extraT, extraT, [x, y, z]);
                        }
                    }
                }
            }

            if(grandchildren[k].nodeName == "materials"){

                var grandgrandchildren = grandchildren[k].children;
                var material = this.reader.getString(grandgrandchildren[0], "id");
                if(material == null){
                    onXMLMinorError("Unable to parse the material ID, assuming default material");
                    material ="mat0";
                }
            }

            if(grandchildren[k].nodeName == "texture"){

                var textID = this.reader.getString(grandchildren[k], "id");
                if(textID == null){
                    onXMLMinorError("Unable to parse the texture, assuming default texture");
                    textID = "red";
                }
                var length_s = this.reader.getFloat(grandchildren[k], "length_s");
                if (!(length_s != null && !isNaN(length_s))){
                    this.onXMLMinorError("Unable to parse length_s, assuming length_s = 1.0");
                    length_s = 1.0;
                } 

                var length_t = this.reader.getFloat(grandchildren[k], "length_t");
                if (!(length_t != null && !isNaN(length_t))){
                    this.onXMLMinorError("Unable to parse length_t, assuming length_t = 1.0");
                    length_t = 1.0;
                } 
                textures.push(textID, length_s, length_t);
            }

            if(grandchildren[k].nodeName == "children"){

                var grandgrandchildren = grandchildren[k].children;

                for(var z = 0; z < grandgrandchildren.length; z++){
                    if(grandgrandchildren[z].nodeName == "primitiveref"){
                        
                        var primitiveID = this.reader.getString(grandgrandchildren[z], "id");
                        if(primitiveID == null){
                            onXMLError("Primitive ID missing");
                        }
                        primitives.push(primitiveID);
                    }
                    else {  // grandgrandchildren[z].nodeName == "componentref"

                        var componentID = this.reader.getString(grandgrandchildren[z], "id");
                        if(componentID == null){
                            onXMLError("Component ID missing");
                        }
                        components.push(componentID);
                    }
                }
            }
        }

        var node = new MyGraphNode(componentId, material, textures, transformationrefs, components, primitives,  mat4.clone(extraT));
        this.nodes.push(node);

    }

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
        
        var root_node;
        for(var i = 0; i < this.nodes.length; i++){

            if(this.nodes[i].ID == "child_room"){
                root_node = this.nodes[i];
                break;
            }
        }

        var default_text = "leaves";
        var default_mat = "mat0";
        this.recursiveDisplayNode(root_node, default_text, default_mat);
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    recursiveDisplayNode(node, textIni, matIni){
        
        var material = matIni;
        var texture = textIni;
    
        if(node.material != "inherit")
            material = node.material;

        if(node.texture[0] != "inherit"){

            texture = node.texture[0];
        }

        materialMap.get(material).setTexture(textureMap.get(texture));
        materialMap.get(material).apply();


        if(node.transformations != null)
           this.scene.multMatrix(transformMap.get(node.transformations));

        if(node.extraTransf != null)
            this.scene.multMatrix(node.extraTransf);

        for(var i = 0; i < node.components.length; i++){

           this.scene.pushMatrix();
                   
                this.recursiveDisplayNode(node.components[i], texture, material);

            this.scene.popMatrix();
        }

        for(var i = 0; i < node.primitives.length; i++){
            
            if(node.texture[0] != "inherit"){
                this.primitiveArray[node.primitives[i]].updateTex(node.texture[1], node.texture[2]);
            }
            this.primitiveArray[node.primitives[i]].display();
        }
    }

}