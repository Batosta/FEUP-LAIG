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
     * @param time - The time the animation will be active
     * @param radius - Radius of the circle the object will take
     * @param center - Array with the points that describe the center of the circle the object will take
     * @param angle - Array with the initial angle and the whole rotation angle the object will take
     */
	constructor(scene, time, radius, center, angle){

		super(scene, time);

		this.time = time;
		this.radius = radius;
		this.center = center;
		this.angle = angle;
	}
};