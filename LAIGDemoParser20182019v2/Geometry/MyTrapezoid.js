class MyTrapezoid extends CGFobject
{
	constructor(scene, top, bottom, stacks)
	{
		super(scene);

		this.stacks = stacks;
		this.top = top;
		this.bottom = bottom;

		this.isPiece = false;

		this.initBuffers();
	}

	initBuffers()
	{
		this.vertices = [];
		this.indices = [];
		this.normals = [];


		//Side faces
		for (var i = 0; i < this.stacks; i++)
		{
			this.vertices.push(-this.top/2, 0.5, i/this.stacks);
			this.vertices.push(this.top/2, 0.5,  i/this.stacks);
			this.vertices.push(-this.top/2, 0.5, (i+1)/this.stacks);
			this.vertices.push(this.top/2, 0.5,  (i+1)/this.stacks);

			this.indices.push(this.vertices.length/3 - 4 + 0, this.vertices.length/3 - 4 + 2, this.vertices.length/3 - 4 + 1);
			this.indices.push(this.vertices.length/3 - 4 + 1, this.vertices.length/3 - 4 + 2, this.vertices.length/3 - 4 + 3);

			this.normals.push(0, 1, 0);
			this.normals.push(0, 1, 0);
			this.normals.push(0, 1, 0);
			this.normals.push(0, 1, 0);
		}

		for (var i = 0; i < this.stacks; i++)
		{
			this.vertices.push(-this.bottom/2, -0.5, i/this.stacks);
			this.vertices.push(-this.top/2, 0.5,  i/this.stacks);
			this.vertices.push(-this.bottom/2, -0.5, (i+1)/this.stacks);
			this.vertices.push(-this.top/2, 0.5,  (i+1)/this.stacks);

			this.indices.push(this.vertices.length/3 - 4 + 0, this.vertices.length/3 - 4 + 2, this.vertices.length/3 - 4 + 1);
			this.indices.push(this.vertices.length/3 - 4 + 1, this.vertices.length/3 - 4 + 2, this.vertices.length/3 - 4 + 3);

			this.normals.push(-2/Math.sqrt(this.top*this.top - 2*this.top*this.bottom + this.bottom*this.bottom + 4), -(this.top - this.bottom)/Math.sqrt(this.top*this.top - 2*this.top*this.bottom + this.bottom*this.bottom + 4), 0);
			this.normals.push(-2/Math.sqrt(this.top*this.top - 2*this.top*this.bottom + this.bottom*this.bottom + 4), -(this.top - this.bottom)/Math.sqrt(this.top*this.top - 2*this.top*this.bottom + this.bottom*this.bottom + 4), 0);
			this.normals.push(-2/Math.sqrt(this.top*this.top - 2*this.top*this.bottom + this.bottom*this.bottom + 4), -(this.top - this.bottom)/Math.sqrt(this.top*this.top - 2*this.top*this.bottom + this.bottom*this.bottom + 4), 0);
			this.normals.push(-2/Math.sqrt(this.top*this.top - 2*this.top*this.bottom + this.bottom*this.bottom + 4), -(this.top - this.bottom)/Math.sqrt(this.top*this.top - 2*this.top*this.bottom + this.bottom*this.bottom + 4), 0);
		}

		for (var i = 0; i < this.stacks; i++)
		{
			this.vertices.push(-this.bottom/2, -0.5, i/this.stacks);
			this.vertices.push(this.bottom/2, -0.5,  i/this.stacks);
			this.vertices.push(-this.bottom/2, -0.5, (i+1)/this.stacks);
			this.vertices.push(this.bottom/2, -0.5,  (i+1)/this.stacks);

			this.indices.push(this.vertices.length/3 - 4 + 0, this.vertices.length/3 - 4 + 1, this.vertices.length/3 - 4 + 2);
			this.indices.push(this.vertices.length/3 - 4 + 1, this.vertices.length/3 - 4 + 3, this.vertices.length/3 - 4 + 2);

			this.normals.push(0, -1, 0);
			this.normals.push(0, -1, 0);
			this.normals.push(0, -1, 0);
			this.normals.push(0, -1, 0);
		}

		for (var i = 0; i < this.stacks; i++)
		{
			this.vertices.push(this.top/2, 0.5, i/this.stacks);
			this.vertices.push(this.bottom/2, -0.5,  i/this.stacks);
			this.vertices.push(this.top/2, 0.5, (i+1)/this.stacks);
			this.vertices.push(this.bottom/2, -0.5,  (i+1)/this.stacks);

			this.indices.push(this.vertices.length/3 - 4 + 0, this.vertices.length/3 - 4 + 2, this.vertices.length/3 - 4 + 1);
			this.indices.push(this.vertices.length/3 - 4 + 1, this.vertices.length/3 - 4 + 2, this.vertices.length/3 - 4 + 3);

			this.normals.push(2/Math.sqrt(this.top*this.top - 2*this.top*this.bottom + this.bottom*this.bottom + 4), -(this.top - this.bottom)/Math.sqrt(this.top*this.top - 2*this.top*this.bottom + this.bottom*this.bottom + 4), 0);
			this.normals.push(2/Math.sqrt(this.top*this.top - 2*this.top*this.bottom + this.bottom*this.bottom + 4), -(this.top - this.bottom)/Math.sqrt(this.top*this.top - 2*this.top*this.bottom + this.bottom*this.bottom + 4), 0);
			this.normals.push(2/Math.sqrt(this.top*this.top - 2*this.top*this.bottom + this.bottom*this.bottom + 4), -(this.top - this.bottom)/Math.sqrt(this.top*this.top - 2*this.top*this.bottom + this.bottom*this.bottom + 4), 0);
			this.normals.push(2/Math.sqrt(this.top*this.top - 2*this.top*this.bottom + this.bottom*this.bottom + 4), -(this.top - this.bottom)/Math.sqrt(this.top*this.top - 2*this.top*this.bottom + this.bottom*this.bottom + 4), 0);
		}


		//Back base
		this.vertices.push(-this.top/2, 0.5, 0);
		this.vertices.push(this.top/2, 0.5,  0);
		this.vertices.push(-this.bottom/2, -0.5, 0);
		this.vertices.push(this.bottom/2, -0.5, 0);

		this.indices.push(this.vertices.length/3 - 4 + 0, this.vertices.length/3 - 4 + 1, this.vertices.length/3 - 4 + 2);
		this.indices.push(this.vertices.length/3 - 4 + 1, this.vertices.length/3 - 4 + 3, this.vertices.length/3 - 4 + 2);

		this.normals.push(0, 0, -1);
		this.normals.push(0, 0, -1);
		this.normals.push(0, 0, -1);
		this.normals.push(0, 0, -1);

		//Front base
		this.vertices.push(-this.top/2, 0.5, 1);
		this.vertices.push(this.top/2, 0.5,  1);
		this.vertices.push(-this.bottom/2, -0.5, 1);
		this.vertices.push(this.bottom/2, -0.5, 1);

		this.indices.push(this.vertices.length/3 - 4 + 0, this.vertices.length/3 - 4 + 2, this.vertices.length/3 - 4 + 1);
		this.indices.push(this.vertices.length/3 - 4 + 1, this.vertices.length/3 - 4 + 2, this.vertices.length/3 - 4 + 3);

		this.normals.push(0, 0, 1);
		this.normals.push(0, 0, 1);
		this.normals.push(0, 0, 1);
		this.normals.push(0, 0, 1);


		this.primitiveType=this.scene.gl.TRIANGLES;
		this.initGLBuffers();
    }
    
    updateTex(length_s, length_t){};

	update(time){};
};