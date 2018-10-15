/**
 * MySphere
 * @constructor
 */
class MySphere extends CGFobject
{
	constructor(scene, radius, slices, stacks) 
	{
		super(scene);

		this.radius = radius;
		this.slices = slices;
		this.stacks = stacks;

		this.semiSphere0 = new MySemiSphere(this.scene, slices, stacks);
		this.semiSphere1 = new MySemiSphere(this.scene, slices, stacks);

		this.display();
	};
 
	display() 
	{	

		this.scene.pushMatrix();
			this.scene.scale(this.radius, this.radius, this.radius);
			this.semiSphere0.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
			this.scene.scale(this.radius, this.radius, this.radius);
			this.scene.rotate(Math.PI, 1, 0, 0);
			this.semiSphere0.display();
		this.scene.popMatrix();		
	};
};