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
		this.maxS = 1;
		this.minT = 0;
		this.maxT = 1;

		this.initBuffers();

		this.texCoordsAux = [];

		//this.updateTex(length_s, length_t);
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

		this.initGLBuffers();
	}

	updateTex(length_s, length_t){
		
		for(var i = 0; i < this.texCoords.length; i++){
			if(i % 2 == 0)
				this.texCoordsAux[i] = (this.texCoords[i]/length_s);
				//this.texCoords[i] = this.texCoords[i]/length_s;
			else
				this.texCoordsAux[i] = (this.texCoords[i]/length_t);
				//this.texCoords[i] = this.texCoords[i]/length_t;	
		}

		for(var j = 0; j < this.texCoordsAux.length; j++){
			this.texCoords[j] = this.texCoordsAux[j];
		}

		this.initGLBuffers();
		//console.log("texCoords for rectangle updated correctly");
	};
};