class MyCylinder extends CGFobject{

	constructor(scene, base, top, height, slices, stacks){

		super(scene);

		this.base = base;
		this.top = top;
		this.height = height;
		this.slices = slices;
		this.stacks = stacks;

		this.initBuffers();
	}

	initBuffers(){

		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.textCoords = [];

		var ang = 2*Math.PI/this.slices;
		var diffBaseTop = (this.base-this.top)/this.stacks;
		var theta = Math.atan((this.base-this.top)/this.height);

		for(let j = 0; j <= this.stacks; j++){
			for(let i = 0; i < this.slice; i++){

				let ang1 = Math.cos(i*ang);
				let ang2 = Math.sin(i*ang);

				this.vertices.push(ang1+(diffBaseTop*j), ang2+(diffBaseTop*j), j*height/this.stacks);
				this.normals.push(ang1, ang2, theta);
				this.textCoords.push(i*1/this.slices, j*height/this.stacks);
			}
		}

		for(let k = 0; k < (this.stacks*this.slices); k++){

			if((k+1)%this.slices==0){

    			this.indices.push(k,k+1-this.slices, k+1);
     	        this.indices.push(k,k+1, k+this.slices);
     	        
  			 }

  			 if((k+1)%this.slices!=0){

  			 	 this.indices.push(k, k+1, k+1+this.slices);
    			 this.indices.push(k, k+1+this.slices, k+this.slices);

  			 }
		}
			
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}
}