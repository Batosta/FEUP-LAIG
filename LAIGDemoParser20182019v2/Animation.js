/**
 * Animation class - Represents an animation of an object
 */
class Animation{

	/**
     * @constructor of the animation
     *
     */
	constructor(scene, time){

		this.scene = scene;

		this.animationMatrix = mat4.create();
	}
};