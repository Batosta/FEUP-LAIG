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

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];
        this.primitiveArray = [];

        this.rectangle = null;
        this.triangle = null;
        this.cylinder = null;
        this.sphere = null;
        this.torus = null;

        this.idRoot = null;                    // The id of the root element.

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
    }


    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
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

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

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

        // ambient 
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
        this.background.push(this.r); this.background.push(this.g); this.background.push(this.b); this.background.push(this.a);

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
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed Lights");

        return null;
    }   

    /**
     * Parses the <PRIMITIVES> node.
     * @param {primitives block element} primitivesNode
     */
    parsePrimitives(primitivesNode) {

        var children = primitivesNode.children;

        var numPrimitives = 0;

        // Any number of primitives
        for(var i = 0; i < children.length; i++){

            var values = [];

            // Get id of the current primitive
            var primitiveId = this.reader.getString(children[i], 'id');
            if(primitiveId == null)
                return "no ID defined for primitive";

            var grandChildren = children[i].children;

            if(grandChildren[0].nodeName == "rectangle"){            // Retrieves the rectangle specifications

                // x1
                var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                if (!(x1 != null && !isNaN(x1)))
                    return "unable to parse first x-coordinate of the rectangle for ID = " + primitiveId;
                else
                    values.push(x1);
                
                // y1
                var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                if (!(y1 != null && !isNaN(y1)))
                    return "unable to parse first y-coordinate of the rectangle for ID = " + primitiveId;
                else
                    values.push(y1);
                
                // x2
                var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                if (!(x2 != null && !isNaN(x2)))
                    return "unable to parse second x-coordinate of the rectangle for ID = " + primitiveId;
                else
                    values.push(x2);
                
                // y2
                var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if (!(y2 != null && !isNaN(y2)))
                    return "unable to parse second y-coordinate of the rectangle for ID = " + primitiveId;
                else
                    values.push(y2);

                this.primitiveArray[primitiveId] = new MyRectangle(this.scene, x1, x2, y1, y2);
            } 
            else if(grandChildren[0].nodeName == "triangle"){             // Retrieves the triangle specifications

                // x1
                var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                if (!(x1 != null && !isNaN(x1)))
                    return "unable to parse first x-coordinate of the triangle for ID = " + primitiveId;
                else
                    values.push(x1);
                
                // y1
                var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                if (!(y1 != null && !isNaN(y1)))
                    return "unable to parse first y-coordinate of the triangle for ID = " + primitiveId;
                else
                    values.push(y1);
                
                // z1
                var z1 = this.reader.getFloat(grandChildren[0], 'z1');
                if (!(z1 != null && !isNaN(z1)))
                    return "unable to parse first z-coordinate of the triangle for ID = " + primitiveId;
                else
                    values.push(z1);
                
                // x2
                var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                if (!(x2 != null && !isNaN(x2)))
                    return "unable to parse second x-coordinate of the triangle for ID = " + primitiveId;
                else
                    values.push(x2);
                
                // y2
                var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if (!(y2 != null && !isNaN(y2)))
                    return "unable to parse second y-coordinate of the triangle for ID = " + primitiveId;
                else
                    values.push(y2);
                
                // z2
                var z2 = this.reader.getFloat(grandChildren[0], 'z2');
                if (!(z2 != null && !isNaN(z2)))
                    return "unable to parse second z-coordinate of the triangle for ID = " + primitiveId;
                else
                    values.push(z2);

                // x3
                var x3 = this.reader.getFloat(grandChildren[0], 'x3');
                if (!(x3 != null && !isNaN(x3)))
                    return "unable to parse third x-coordinate of the triangle for ID = " + primitiveId;
                else
                    values.push(x3);
                
                // y3
                var y3 = this.reader.getFloat(grandChildren[0], 'y3');
                if (!(y3 != null && !isNaN(y3)))
                    return "unable to parse third y-coordinate of the triangle for ID = " + primitiveId;
                else
                    values.push(y3);
                
                // z1
                var z3 = this.reader.getFloat(grandChildren[0], 'z3');
                if (!(z3 != null && !isNaN(z3)))
                    return "unable to parse third z-coordinate of the triangle for ID = " + primitiveId;
                else
                    values.push(z3);

                this.primitiveArray[primitiveId] = new MyTriangle(this.scene, x1, x2, x3, y1, y2, y3, z1, z2, z3);
            } 
            else if(grandChildren[0].nodeName == "cylinder"){            // Retrieves the cylinder specifications

                // base
                var base = this.reader.getFloat(grandChildren[0], 'base');
                if (!(base != null && !isNaN(base)))
                    return "unable to parse base of the cylinder for ID = " + primitiveId;
                else
                    values.push(base);
                
                // top
                var top = this.reader.getFloat(grandChildren[0], 'top');
                if (!(top != null && !isNaN(top)))
                    return "unable to parse top of the cylinder for ID = " + primitiveId;
                else
                    values.push(top);
                
                // height
                var height = this.reader.getFloat(grandChildren[0], 'height');
                if (!(height != null && !isNaN(height)))
                    return "unable to parse height of the cylinder for ID = " + primitiveId;
                else
                    values.push(height);
                
                // slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices of the cylinder for ID = " + primitiveId;
                else
                    values.push(slices);

                // stacks
                var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks)))
                    return "unable to parse stacks of the cylinder for ID = " + primitiveId;
                else
                    values.push(stacks);

                this.primitiveArray[primitiveId] = new MyCylinder(this.scene, base, top, height, slices, stacks);
            } 
            else if(grandChildren[0].nodeName == "sphere"){            // Retrieves the sphere specifications
            
                // radius
                var radius = this.reader.getFloat(grandChildren[0], 'radius');
                if (!(radius != null && !isNaN(radius)))
                    return "unable to parse radius of the sphere for ID = " + primitiveId;
                else
                    values.push(radius);
                
                // slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices of the sphere for ID = " + primitiveId;
                else
                    values.push(slices);

                // stacks
                var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks)))
                    return "unable to parse stacks of the sphere for ID = " + primitiveId;
                else
                    values.push(stacks);
            } 
            else if(grandChildren[0].nodeName == "torus"){            // Retrieves the torus specifications

                // inner
                var inner = this.reader.getFloat(grandChildren[0], 'inner');
                if (!(inner != null && !isNaN(inner)))
                    return "unable to parse inner of the torus for ID = " + primitiveId;
                else
                    values.push(inner);
                
                // outer
                var outer = this.reader.getFloat(grandChildren[0], 'outer');
                if (!(outer != null && !isNaN(outer)))
                    return "unable to parse outer of the torus for ID = " + primitiveId;
                else
                    values.push(outer);
                
                // slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices of the torus for ID = " + primitiveId;
                else
                    values.push(slices);
                
                // loops
                var loops = this.reader.getFloat(grandChildren[0], 'loops');
                if (!(loops != null && !isNaN(loops)))
                    return "unable to parse loops of the torus for ID = " + primitiveId;
                else
                    values.push(loops);
            } 
            else
                return "primitive undefined for ID = " + primitiveId;


            numPrimitives++;
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

        var pathTexture = [];           // retirar isto?

        for(var i = 0; i < children.length; i++){

            var tID = this.reader.getString(children[i], 'id');
            var path = this.reader.getString(children[i], 'file');

            if(tID == null || path == null){
                this.onXMLMinorError("Error on ID or pathname");
            }
            
            var newTexture = new CGFappearance(this.scene);
            newTexture.loadTexture(path);
            textureMap.set(tID, newTexture);
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

            var newMaterial = new CGFappearance(this.scene);

            if(materialID == null)
                return "Error, ID missing";

            if(shininess == null){
                this.onXMLMinorError("shininess missing, assuming default value");
                shininess = 0.1;
            }
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
                this.onXMLMinorError("emission component missing. Assuming default values");
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
        console.log(materialMap);
        
        return null;
    }

    /**
    *Parses the <VIEWS> block
    *@param {views block element} viewsNode
    */
    parseViews(viewsNode){

        this.defaultView = this.reader.getString(viewsNode, 'default');
        this.fromTo = [];
    
        var children = viewsNode.children;
        var nodesName = [];

        for(var i = 0; i < children.length; i++){
            nodesName.push(children[i].nodeName);
        }

        for(var i = 0; i < children.length; i++){
            
            var id = this.reader.getString(children[i], 'id');
            
            if(id == this.defaultView){

                var type = children[i].nodeName;

                if(type == "perspective"){
                    this.near = this.reader.getFloat(children[i], 'near');
                    this.far = this.reader.getFloat(children[i], 'far');
                    this.angle = this.reader.getFloat(children[i], 'angle');

                    var grandchildren = children[i].children;
                    var nodesName2 = [];
                    for(var j = 0; j < grandchildren.length; j++){
                        nodesName2.push(grandchildren[j].nodeName);
                    }

                    var fromIndex = nodesName2.indexOf("from");
                    var toIndex = nodesName2.indexOf("to");

                    this.x = this.reader.getFloat(grandchildren[fromIndex], 'x');
                    this.y = this.reader.getFloat(grandchildren[fromIndex], 'y');
                    this.z = this.reader.getFloat(grandchildren[fromIndex], 'z');
                    this.fromTo.push(this.x); this.fromTo.push(this.y); this.fromTo.push(this.z);

                    this.x = this.reader.getFloat(grandchildren[toIndex], 'x');
                    this.y = this.reader.getFloat(grandchildren[toIndex], 'y');
                    this.z = this.reader.getFloat(grandchildren[toIndex], 'z');
                    this.fromTo.push(this.x); this.fromTo.push(this.y); this.fromTo.push(this.z);
                
                }else if(type == "ortho"){

                    this.idOrtho = this.reader.getString(children[i], 'id');
                    this.nearOrtho = this.reader.getFloat(children[i], 'near');
                    this.leftOrtho = this.reader.getFloat(children[i], 'left');
                    this.rightOrtho = this.reader.getFloat(children[i], 'right');
                    this.topOrtho = this.reader.getFloat(children[i], 'top');
                    this.bottomOrtho = this.reader.getFloat(children[i], 'bottom');  
                }

            }else{
                continue;
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
            this.onXMLMinorError("unable to parse value for componentId");
        }
        

        var transformationrefs = null;
        var material;
        var textures = [];  // order: [textID, length_s, length_t, ...]
        var primitives = [];
        var components = [];

        var grandchildren = children[i].children;

        for(let k = 0; k < grandchildren.length; k++){

            if(grandchildren[k].nodeName == "transformation"){

                var grandgrandchildren = grandchildren[k].children;

                if(grandgrandchildren.length != 0){

                    for(var j = 0; j < grandgrandchildren.length; j++){

                            this.scene.loadIdentity(); 
                               
                            if(grandgrandchildren[j].nodeName == "transformationref"){
                                    var transformationId = this.reader.getString(grandgrandchildren[0], "id");
                                    transformationrefs = transformationId;
                            }

                            if(grandgrandchildren[j].nodeName == "translate"){
                               
                                var x = this.reader.getFloat(grandgrandchildren[j], 'x');
                                if (!(x != null && !isNaN(x)))
                                return "unable to parse x component of the translation";
                                // y
                                var y = this.reader.getFloat(grandgrandchildren[j], 'y');
                                if (!(y != null && !isNaN(y)))
                                return "unable to parse y component of the translation";
                                // z
                                var z = this.reader.getFloat(grandgrandchildren[j], 'z');
                                if (!(z != null && !isNaN(z)))
                                return "unable to parse z component of the translation";  
                                //Matriz
                                this.scene.translate(x, y, z);
                                
                            }

                            if(grandgrandchildren[j].nodeName == "rotate"){
                                var axis = this.reader.getString(grandgrandchildren[j], 'axis');
                                if (axis == null)
                                    return "unable to parse the axis of the rotation";
                                // angle
                                var angle = this.reader.getFloat(grandgrandchildren[j], 'angle');
                                if (!(angle != null && !isNaN(angle)))
                                    return "unable to parse angle component of the rotation";
                                //Matriz
                                if(axis == "x"){
                                    this.scene.rotate(angle*DEGREE_TO_RAD, 1, 0, 0);

                                }else if(axis == "y"){
                                    this.scene.rotate(angle*DEGREE_TO_RAD, 0, 1, 0);

                                }else if(axis == "z"){
                                    this.scene.rotate(angle*DEGREE_TO_RAD, 0, 0, 1)
                                }
                            }

                            if(grandgrandchildren[j].nodeName == "scale"){
                                
                                var x = this.reader.getFloat(grandgrandchildren[j], 'x');
                                if (!(x != null && !isNaN(x)))
                                    return "unable to parse x component of the scale";
                                // y
                                var y = this.reader.getFloat(grandgrandchildren[j], 'y');
                                if (!(y != null && !isNaN(y)))
                                    return "unable to parse y component of the scale";
                                // z
                                var z = this.reader.getFloat(grandgrandchildren[j], 'z');
                                if (!(z != null && !isNaN(z)))
                                    return "unable to parse z component of the scale";
                    
                                this.scene.scale(x, y, z);
                            }

                    }
                    var extraTransf = this.scene.getMatrix();
                }
            }

            if(grandchildren[k].nodeName == "materials"){

                var grandgrandchildren = grandchildren[k].children;
                var material = this.reader.getString(grandgrandchildren[0], "id");
            }

            if(grandchildren[k].nodeName == "texture"){

                var textID = this.reader.getString(grandchildren[k], "id");
                var length_s = this.reader.getFloat(grandchildren[k], "length_s");
                var length_t = this.reader.getFloat(grandchildren[k], "length_t");
                textures.push(textID, length_s, length_t);
            }

            if(grandchildren[k].nodeName == "children"){

                var grandgrandchildren = grandchildren[k].children;

                for(var z = 0; z < grandgrandchildren.length; z++){
                    if(grandgrandchildren[z].nodeName == "primitiveref"){
                        
                        var primitiveID = this.reader.getString(grandgrandchildren[z], "id");
                        primitives.push(primitiveID);
                    }
                    else {  // grandgrandchildren[z].nodeName == "componentref"

                        var componentID = this.reader.getString(grandgrandchildren[z], "id");
                        components.push(componentID);
                    }
                }
            }
        }

        var node = new MyGraphNode(componentId, material, textures, transformationrefs, components, primitives, extraTransf);
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

        this.recursiveDisplayNode(root_node);
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
	recursiveDisplayNode(node){
    
        if(node.texture[0] != "inherit")
	       textureMap.get(node.texture[0]).apply();

        if(node.texture[0] != "inherit")
            textureMap.get(node.texture[0]).apply();

        if(node.transformations != null)
           this.scene.multMatrix(transformMap.get(node.transformations));

        if(node.extraTransf != null)
            this.scene.multMatrix(node.extraTransf);

        for(var i = 0; i < node.components.length; i++){

            this.scene.pushMatrix();
                   
                this.recursiveDisplayNode(node.components[i]);

            this.scene.popMatrix();
        }

        for(var i = 0; i < node.primitives.length; i++){

            this.primitiveArray[node.primitives[i]].display();
        }
	}
}