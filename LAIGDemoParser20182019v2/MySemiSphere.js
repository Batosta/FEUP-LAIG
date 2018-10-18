/**
 * MySemiSphere
 * @constructor
 */
class MySemiSphere extends CGFobject
{
	constructor(scene,slices,stacks) 
	{
		super(scene);

		this.slices = slices;
		this.stacks = stacks;

		this.initBuffers();
	};
 
	initBuffers() 
	{	
		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];

		var ang1 = 2*Math.PI/this.slices; //theta
		var ang2 = (Math.PI/2)/this.stacks; //phi

		for(let j = 0; j <= this.stacks ; j++){
			for(let i = 0; i <= this.slices; i++){
					
					let x = Math.cos(ang1*i) * Math.cos(ang2*j);
					let y = Math.sin(ang1*i) * Math.cos(ang2*j);
					let z = Math.sin(ang2*j);

					this.vertices.push(x,y,z);
					this.normals.push(x,y,z);
					this.texCoords.push(i * 1/this.slices, j * 1/this.stacks);
			}	
		}

		for(let i = 0; i < this.stacks; i++){
			for(let j = 0; j < this.slices; j++){

           		 this.indices.push(i * (this.slices + 1) + j, i * (this.slices + 1) + 1 + j, (i+1) * (this.slices+1)+j);
           		 this.indices.push(i * (this.slices + 1) + 1 + j, (i + 1) * (this.slices + 1) + 1 + j,  (i + 1) * (this.slices + 1) + j );
			}
		}
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};

    updateTex(length_s, length_t){
        for(var i = 0; i < this.texCoords.length; i++){
            if(i % 2 == 0)
                this.texCoords[i] = this.texCoords[i]/length_s;
            else
                this.texCoords[i] = this.texCoords[i]/length_t;
        }
        this.initGLBuffers();
        //console.log("texCoords for semisphere updated correctly!");
    };
};