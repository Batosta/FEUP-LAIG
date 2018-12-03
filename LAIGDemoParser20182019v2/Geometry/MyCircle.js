/**
 * MyCircle class - Represents a circle
 */
class MyCircle extends CGFobject
{
	/**
     * @constructor of the circle
     *
     * @param scene - The global scene
     * @param slices - Number of slices (vertices) on the circle
     */
	constructor(scene, slices)
    {
    	super(scene);

    	this.slices = slices;

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

		// Angle difference between each vertex
		var ang = 2 * Math.PI / this.slices;
		// Variable to be incremented by the ang
		var rotAngle = 0;

		//Initial values
		this.vertices.push(0, 0, 0);
		this.normals.push(0, 0, 1);
		this.texCoords.push(0.5, 0.5);
		
		// for that determines the vertices, normals and indices values
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
        // for that determines the texture coordinates
		for(var i = 0; i < this.slices; i++){

		    this.texCoords.push(0.5 + Math.cos(rotAngle)/2.0, 0.5 - Math.sin(rotAngle)/2.0);
		    rotAngle += ang;
		}

		this.primitiveType=this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};

	update(time){};
};