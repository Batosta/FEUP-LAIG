/**
 * MyGraphNode class - Represents each node of the graph (a component)
 */
class MyGraphNode {
	
	/**
     * @constructor of the cylinder
     *
     * @param ID - ID of the node (component's name)
     * @param material - The material of this node (and it's children if they inherit it)
     * @param texture - The texture of this node (and it's children if they inherit it)
     * @param transformations - Transformations to be applied to this node and it's children (componentref)
     * @param components - Chldren of this node (other components)
     * @param primitives - Primitives of this node (primitiveref)
     * @param extraTransf - Transformations to be applied to this node and it's children (translate/rotate/scale)
     * @param animations - animations to be applied to this node
     */
	constructor(ID, material, texture, transformations, components, primitives, extraTransf, animations){
		this.ID = ID;
		this.material = material;
		this.texture = texture;
		this.transformations = transformations;
		this.components = components;
		this.primitives = primitives;
        this.extraTransf = extraTransf;	
        this.animations = animations;
    }
    
    update(currentTime){    
        for(var i = 0;  i < this.animations.length; i++){

            //console.log("I AM UPDATING AN ANIMATION ON THE COMPONENTS");
            //console.log(this.animations[i]);

            this.animations[i].update(currentTime);
        }
    }
}