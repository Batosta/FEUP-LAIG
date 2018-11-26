// Multiplier to convert from degree to radians
var DEGREE_TO_RAD = Math.PI / 180;

/**
 * CircularAnimation class - Represents a circular animation of an object
 */
class CircularAnimation extends Animation{
	
	/**
     * @constructor of the semi-sphere
     *
     * @param scene - Global scene
     * @param span - The time the animation will be active
     * @param radius - Radius of the circle the object will take
     * @param center - Array with the points that describe the center of the circle the object will take
     * @param angle - Array with the initial angle and the whole rotation angle the object will take
     */
	constructor(scene, span, radius, center, startAng, rotAng){

		super(scene, span);

          this.scene = scene;
          this.span = span;
          this.radius = radius;
          this.center = center;
          this.startAng = startAng*DEGREE_TO_RAD;
          this.rotAngle = rotAng*DEGREE_TO_RAD;

          this.speedRotation = this.rotAngle / this.span;

          this.counter = 0;
     }
     
     update(deltaTime){
		this.counter += (deltaTime/1000);

		if(this.counter > this.span)
               this.counter = this.span;

          this.currentAngle = this.startAng + this.speedRotation * this.counter;
     }

     apply(){
          this.scene.translate(this.center[0], this.center[1], this.center[2]);
          this.scene.rotate(this.currentAngle,0,1,0);
          this.scene.translate(this.radius,0,0);
     }
};