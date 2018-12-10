/**
 * MySphere class - Represents the primitive sphere
 */
class MySphere extends CGFobject
{
	/**
     * @constructor of the sphere
     *
     * @param scene - The global scene
     * @param radius - Radius of the sphere
     * @param slices - Number of slices (vertices) for each stack of the sphere
     * @param stacks - Number of stacks of the sphere
     */
	constructor(scene, radius, slices, stacks) 
	{
		super(scene);

		this.radius = radius;
		this.slices = slices;
		this.stacks = stacks;

		// A sphere is made out of 2 semi-spheres 
		this.semiSphere0 = new MySemiSphere(this.scene, slices, stacks);
		this.semiSphere1 = new MySemiSphere(this.scene, slices, stacks);

		this.isPiece = false;

		this.display();
	};
 
 	/**
     * Function that displays the whole sphere
     */
	display() 
	{	

		// The first semi-sphere display
		this.scene.pushMatrix();
			this.scene.scale(this.radius, this.radius, this.radius);
			this.semiSphere0.display();
		this.scene.popMatrix();

		// The second semi-sphere display
		this.scene.pushMatrix();
			this.scene.scale(this.radius, this.radius, this.radius);
			this.scene.rotate(Math.PI, 1, 0, 0);
			this.semiSphere0.display();
		this.scene.popMatrix();		
	};

	/**
     * Function that updates the texture coordinates
     * @length_s - The length of the s component on each texture
     * @length_t - The length of the t component on each texture
     */
	updateTex(length_s, length_t){};

	update(time){};
};