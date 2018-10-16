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

    	 this.initBuffers();
  	};

  	initBuffers() {
    }
};