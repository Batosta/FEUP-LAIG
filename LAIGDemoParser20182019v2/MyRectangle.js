class MyRectangle{

	constructor(scene, x1, x2, y1, y2) extends CGFobject{

		super(scene);

		this.x1 = x1;
		this.x2 = x2;
		this.y1 = y1;
		this.y2 = y2;
		
		this.initBuffers();
	}

	initBuffers(){

		this.vertices = [-x1, -y1, 0,
						x2, -y1, 0,
						-x1, y2, 0,
						x2, y2, 0
		];

		this.indices = [0, 1, 2,
						3, 2, 1
		];

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initBuffers();
	}
}