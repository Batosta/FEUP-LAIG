class MyRectangle{

	constructor(scene, x1, x2, x3, y1, y2, y3, z1, z2, z3) extends CGFobject{

		super(scene);

		this.x1 = x1;
		this.x2 = x2;
		this.x3 = x3;
		this.y1 = y1;
		this.y2 = y2;
		this.y3 = y3;
		this.z1 = z1;
		this.z2 = z2;
		this.z3 = z3;
		
		this.initBuffers();
	}

	initBuffers(){

		this.vertices = [-x1, -y1, -z1,
						x2, -y2, -z2,
						x3, y2, z3
		];

		this.indices = [0, 1, 2];

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initBuffers();
	}
}