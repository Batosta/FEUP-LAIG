class Node{
	constructor(material, texture, mat, children){
		this.material = material;
		this.texture = texture;
		this.mat = mat; // matriz 4.4
		this.children = children;
	}
	push(nodeName){
		this.children.push(nodeName);
	}
}