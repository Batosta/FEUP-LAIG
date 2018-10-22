/**
 * LinearAnimation class - Represents a linear animation of an object
 */
class LinearAnimation extends Animation{
	
	/**
     * @constructor of the semi-sphere
     *
     * @param scene - Global scene
     * @param time - The time the animation will be active
     * @param controlPoints - Array of arrays that contain all the control points of the linear animation
     */
	constructor(scene, time, controlPoints){

		super(scene, time);

		this.time = time;
		this.controlPoints = controlPoints;
	}
};