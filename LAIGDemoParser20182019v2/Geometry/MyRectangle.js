/**
 * MyRectangle class - Represents the primitive rectangle
 */
class MyRectangle extends CGFobject{

	/**
     * @constructor of the rectangle
     *
     * @param scene - The global scene
     * @param x1 - The X coordinate of the first point
     * @param x2 - The X coordinate of the second point
     * @param y1 - The Y coordinate of the first point
     * @param y2 - The Y coordinate of the second point
     */
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

		this.sLast = null;
		this.tLast = null;
		
		this.initBuffers();
	}

	/**
     * Function that determines each vertice position, indices, normals and texture coordinates
     */
	initBuffers(){

		//Arrays that contain the values needed to the construction of the rectangle
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

	/**
     * Function that updates the texture coordinates
     * @length_s - The length of the s component on each texture
     * @length_t - The length of the t component on each texture
     */
	updateTex(length_s, length_t){
		
		// Makes sure that the update of the texture coordinates is only made once for each time the length_s and/or length_t are updated
		if(length_s != this.sLast || length_t != this.tLast){

			for(var i = 0; i < this.texCoords.length; i++){
				if(i % 2 == 0){

					this.texCoords[i] = this.origTex[i]/length_s;
				}else{

					this.texCoords[i] = this.origTex[i]/length_t;
				}
			}
			this.updateTexCoordsGLBuffers();
			this.sLast = length_s;
			this.tLast = length_t;
		}
	};

	update(time){};
};