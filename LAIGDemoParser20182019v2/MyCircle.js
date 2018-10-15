/**
 * MyCircle
 *
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyCircle extends CGFobject
{
	constructor(scene, slices, minS = 0, maxS = 1, minT = 0, maxT = 1)
    {
    	super(scene);
    	this.slices = slices;
    	this.initBuffers();
    };

	initBuffers() 
	{
		
		this.vertices = [
		];

		this.indices = [
		];
		
		this.normals = [
		];

		this.texCoords = [
		];


		var rotAngle = 0;
		var ang = 2 * Math.PI / this.slices;


		this.vertices.push(0, 0, 0);
		this.normals.push(0, 0, 1);
		this.texCoords.push(0.5, 0.5);
		
		for(var i = 1; i <= this.slices; i++){

			this.vertices.push(Math.cos(rotAngle), Math.sin(rotAngle), 0);
			this.normals.push(0, 0, 1);


			if(i == this.slices){
				this.indices.push(i, 1, 0);
			} else{
				this.indices.push(i, i+1, 0);
			}

			rotAngle += ang;
		}



        rotAngle = 0;
		for(var i = 0; i < this.slices; i++){

		    this.texCoords.push(0.5 + Math.cos(rotAngle)/2.0, 0.5 - Math.sin(rotAngle)/2.0);
		    rotAngle += ang;
		}


	    
		this.primitiveType=this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};
};