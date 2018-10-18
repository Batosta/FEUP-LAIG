/**
 * MyRectangle
 * @constructor
 */
class MyRectangle extends CGFobject{

	constructor(scene, x1, x2, y1, y2){

		super(scene);

		this.x1 = x1;
		this.x2 = x2;
		this.y1 = y1;
		this.y2 = y2;
		this.minS = 0;
		this.maxS = x2-x1;
		this.minT = 0;
		this.maxT = y2-y1;

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

		this.normals = [0, 0, 1,
						0, 0, 1,
						0, 0, 1,
						0, 0, 1
		];

		this.texCoords = [this.minS, this.maxT,
						 this.maxS, this.maxT,
						 this.minS, this.minT,
						 this.maxS, this.minT
		];

		this.origTex = this.texCoords.slice();

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

	updateTex(length_s, length_t){
		
		for(var i = 0; i < this.texCoords.length; i++){
			if(i % 2 == 0){

				this.texCoords[i] = this.origTex[i]/length_s;
			}else{

				this.texCoords[i] = this.origTex[i]/length_t;
			}
		}
		this.updateTexCoordsGLBuffers();
	};
};