class Node{
	constructor(ID, material, texture, mat, children, leaf){
		this.ID = ID;
		this.material = material;
		this.texture = texture;
		this.mat = mat; // matriz 4.4
		this.childrenNode = children;
		this.childrenLeaf = leaf;
	}
	push(nodeName){
		this.children.push(nodeName);
	}
}
