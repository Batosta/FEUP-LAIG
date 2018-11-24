/**
 * MyTorus class - Represents the primitive torus
 */
class MyTorus extends CGFobject {

    /**
     * @constructor of the torus
     *
     * @param scene - The global scene
     * @param inner - Radius of the torus
     * @param outer - Radius of each loop
     * @param slices - Number of slices (vertices) for each loop of the torus
     * @param loops - Number of loops of the sphere
     */
  	constructor(scene, inner, outer, slices, loops) {

    	 super(scene);

    	 this.inner = inner;
    	 this.outer = outer;
    	 this.slices = slices;
    	 this.loops = loops;

       this.texCoordsAux = [];

    	 this.initBuffers();
  	};

    /**
     * Function that determines each vertice position, indices, normals and texture coordinates
     */
  	initBuffers() {

      //Arrays that contain the values needed to the construction of the torus
      this.vertices = [
      ];
      this.indices = [
      ];
      this.normals = [
      ];
      this.texCoords = [
      ];

      // Angle difference between each vertex in each loop
      var angle = (2 * Math.PI) / this.slices;
      // Angle difference between loops
      var angle1 = (2 * Math.PI) / this.loops; 
      
      // for that determines the vertices, indices, normals and texture coordinates values
      for(let j = 0; j < this.loops; j++){
        for(let i = 0; i < this.slices; i++){

          let ang1 = Math.cos(i*angle);
          let ang2 = Math.sin(i*angle);

          var v, u;
          v = i * angle;
          u = j * angle1;

          this.vertices.push((this.outer + this.inner*Math.cos(v))*Math.cos(u), (this.outer + this.inner*Math.cos(v))*Math.sin(u), this.inner * Math.sin(v));

          this.indices.push(i+j*this.slices, i+(j+1)%this.loops*this.slices, (i+1)%this.slices+j*this.slices);
          this.indices.push(i+(j+1)%this.loops*this.slices, (i+1)%this.slices+(j+1)%this.loops*this.slices, (i+1)%this.slices+j*this.slices);

          this.normals.push(ang1, ang2, 0);
          this.texCoords.push(i/this.slices, j/this.loops);
        }
      }
      this.primitiveType = this.scene.gl.TRIANGLES;

      this.initGLBuffers();
    };

    /**
     * Function that updates the texture coordinates
     * @length_s - The length of the s component on each texture
     * @length_t - The length of the t component on each texture
     */
    updateTex(length_s, length_t){};

    update(time){};
};