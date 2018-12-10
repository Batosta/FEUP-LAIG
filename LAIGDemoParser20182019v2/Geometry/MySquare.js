/**
 * MyRectangle class - Represents the primitive rectangle
 */
var DEGREE_TO_RAD = Math.PI / 180;
class MySquare extends CGFobject{

	constructor(scene, texangle){

		super(scene);

		this.x1 = 0.0;
		this.x2 = 1.0;
		this.y1 = 0.0;
        this.y2 = 1.0;

        this.angle = texangle*DEGREE_TO_RAD;
        
		this.minS = 0;
		this.maxS = 1;
		this.minT = 0;
		this.maxT = 1;

		this.isPiece = false;

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
		this.texCoords = [
            0, 0, 
            Math.cos(this.angle), Math.sin(this.angle), 
            -Math.sin(this.angle), Math.cos(this.angle),
            Math.cos(this.angle) - Math.sin(this.angle), Math.sin(this.angle) + Math.cos(this.angle)
        ];

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

	/**
     * Function that updates the texture coordinates
     * @length_s - The length of the s component on each texture
     * @length_t - The length of the t component on each texture
     */
	updateTex(length_s, length_t){};

	update(time){};
};