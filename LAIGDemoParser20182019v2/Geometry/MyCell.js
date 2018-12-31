/**
 * MyCell class - Represents the primitive of an empty cell
 */
class MyCell extends CGFobject
{
	/**
     * @constructor of the cell
     *
     * @param scene - The global scene
     */
	constructor(scene) 
	{
		super(scene);

		this.cell = new MyRectangle(this.scene, -0.5, 0.5, -0.5, 0.5);

		this.display();
	};
 
 	/**
     * Function that displays the cell
     */
	display() 
	{	

		this.scene.pushMatrix();
			this.scene.scale(0.75, 0.75, 0.75);
			this.cell.display();
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