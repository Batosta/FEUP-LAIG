/**
 * MyTriangle class - Represents the primitive triangle
 */
class MyTriangle extends CGFobject{

	/**
     * @constructor of the triangle
     *
     * @param scene - The global scene
     * @param x1 - The X coordinate of the first point
     * @param x2 - The X coordinate of the second point
     * @param x3 - The X coordinate of the third point
     * @param y1 - The Y coordinate of the first point
     * @param y2 - The Y coordinate of the second point
     * @param y3 - The Y coordinate of the third point
     * @param z1 - The Z coordinate of the first point
     * @param z2 - The Z coordinate of the second point
     * @param z3 - The Z coordinate of the third point
     */
	constructor(scene, x1, x2, x3, y1, y2, y3, z1, z2, z3){

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
		this.lenght_t = 1;
		this.lenght_s = 1;
		
		this.initBuffers();
	}

	/**
     * Function that determines each vertice position, indices, normals and texture coordinates
     */
	initBuffers(){

		//Distances between each point
		var a = Math.sqrt(Math.pow(this.x1-this.x3, 2) + Math.pow(this.y1-this.y3, 2) + Math.pow(this.z1-this.z3, 2));
		var b = Math.sqrt(Math.pow(this.x2-this.x1, 2) + Math.pow(this.y2-this.y1, 2) + Math.pow(this.z2-this.z1, 2));
		var c = Math.sqrt(Math.pow(this.x3-this.x2, 2) + Math.pow(this.y3-this.y2, 2) + Math.pow(this.z3-this.z2, 2));

		//Inner angle
		var value = (Math.pow(a, 2) - Math.pow(b, 2) + Math.pow(c, 2)) / (2*a*c);
		var beta = Math.acos(value);

		//Arrays that contain the values needed to the construction of the triangle
		this.vertices = [this.x1, this.y1, this.z1,
						this.x2, this.y2, this.z2,
						this.x3, this.y2, this.z3
		];
		this.indices = [0, 1, 2];
		this.normals = [0, 0, 1,
						0, 0, 1,
						0, 0, 1	
		];
		this.texCoords = [c - a*value, a*Math.sin(beta),
						   0, this.lenght_t,
						   c, this.lenght_t
		];

		this.origTex = this.texCoords.slice();

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};

	/**
     * Function that updates the texture coordinates
     * @length_s - The length of the s component on each texture
     * @length_t - The length of the t component on each texture
     */
	updateTex(length_s, length_t){
		
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
};