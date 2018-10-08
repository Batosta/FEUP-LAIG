class MyGraphNode{
	constructor(ID, material, texture, transformations, components, primitives){
		this.ID = ID;
		this.material = material;
		this.texture = texture;
		this.transformations = transformations; // matriz 4.4
		this.components = components;
		this.primitives = primitives;
	}
}
