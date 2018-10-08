Class Node{
	constructor(){
		this.material = null;
		this.texture = null;
		this.mat = null; // matriz 4.4
		this.geometry = null;
		this.children = [];
	}
	push(nodeName){
		this.children.push(nodeName);
	}
}