/**
 * MySemiSphere class - Represents a semi-sphere
 */
class MySemiSphere extends CGFobject
{
	/**
     * @constructor of the semi-sphere
     *
     * @param scene - The global scene
     * @param slices - Number of slices (vertices) for each stack of the semi-sphere
     * @param stacks - Number of stacks of the semi-sphere
     */
	constructor(scene, slices, stacks) 
	{
		super(scene);

		this.slices = slices;
		this.stacks = stacks;

		this.texCoordsAux = [];

		this.initBuffers();
	};
 
 	/**
     * Function that determines each vertice position, indices, normals and texture coordinates
     */
	initBuffers() 
	{	
		//Arrays that contain the values needed to the construction of the circle
		this.vertices = [
		];
		this.indices = [
		];
		this.normals = [
		];
		this.texCoords = [
		];

		// Angle difference between each vertex in each stack
		var ang1 = 2*Math.PI/this.slices;
		// Angle difference between stacks
		var ang2 = (Math.PI/2)/this.stacks;

		// for that determines the vertices, normals and texture coordinates values
		for(let j = 0; j <= this.stacks ; j++){
			for(let i = 0; i <= this.slices; i++){
					
					let x = Math.cos(ang1*i) * Math.cos(ang2*j);
					let y = Math.sin(ang1*i) * Math.cos(ang2*j);
					let z = Math.sin(ang2*j);

					this.vertices.push(x,y,z);
					this.normals.push(x,y,z);
					this.texCoords.push(i * 1/this.slices, j * 1/this.stacks);
			}	
		}

		// for that determines the indices values
		for(let i = 0; i < this.stacks; i++){
			for(let j = 0; j < this.slices; j++){

           		 this.indices.push(i * (this.slices + 1) + j, i * (this.slices + 1) + 1 + j, (i+1) * (this.slices+1)+j);
           		 this.indices.push(i * (this.slices + 1) + 1 + j, (i + 1) * (this.slices + 1) + 1 + j,  (i + 1) * (this.slices + 1) + j );
			}
		}

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};

	update(time){};
};