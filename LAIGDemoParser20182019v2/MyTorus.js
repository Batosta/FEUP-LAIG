/**
 * MyTorus
 * @constructor
 */
class MyTorus extends CGFobject {
  	constructor(scene, inner, outer, slices, loops) {

    	 super(scene);

    	 this.inner = inner;    //  The "tube" radius
    	 this.outer = outer;    //  Radius of the the "circular axis" of the torus
    	 this.slices = slices;  //  Number of vertexes on each loop
    	 this.loops = loops;    //  Number of "circles" in the torus

       this.texCoordsAux = [];

    	 this.initBuffers();
  	};

  	initBuffers() {

      this.vertices = [];
      this.normals = [];
      this.indices = [];
      this.texCoords = [];

      var angle = (2 * Math.PI) / this.slices;
      var angle1 = (2 * Math.PI) / this.loops; 
      
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

    updateTex(length_s, length_t){};
};