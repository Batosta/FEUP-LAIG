class MyRectangle extends CGFobject{

	constructor(scene, x1, x2, y1, y2){

		super(scene);

		this.x1 = x1;
		this.x2 = x2;
		this.y1 = y1;
		this.y2 = y2;
		
		this.initBuffers();
	}

	initBuffers(){

		this.vertices = [this.x1, this.y1, 0,
						this.x2, this.y1, 0,
						this.x1, this.y2, 0,
						this.x2, this.y2, 0
		];

		this.indices = [0, 1, 2,
						3, 2, 1
		];

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}
}