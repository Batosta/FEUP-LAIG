/**
 * LinearAnimation class - Represents a linear animation of an object
 */
class LinearAnimation extends Animation{
	
	/**
     * @constructor of the semi-sphere
     *
     * @param scene - Global scene
     * @param span - The time the animation will be active
     * @param controlPoints - Array of arrays that contain all the control points of the linear animation
     */
	constructor(scene, span, controlPoints){

		super(scene, span);

		this.scene = scene;

		this.span = span;

		this.controlPoints = controlPoints;

		//Total distance for the animation, begins at 0.
		this.distance = 0;

		//Distance that for each segment. Ex: Cp1 -> Cp2; Cp2 -> Cp3; Cpn -> Cpn+1
		this.distancesSegment = [];

		this.displacement;

		this.angleRotation;
		
		this.p1 = [0,0,0];

		this.p2= [0,0,0];

		//Calculates the total distance and places it on this.distance.
		//While it calculates it, segment distances are pushed into distancesSegment
		for(var i = 0; i < controlPoints.length - 1; i++){

			var vector1 = vec3.fromValues(controlPoints[i][0], controlPoints[i][1], controlPoints[i][2]);

			var vector2 = vec3.fromValues(controlPoints[i+1][0], controlPoints[i+1][1], controlPoints[i+1][2])

			this.distance += vec3.dist(vector1, vector2);
			
			this.distancesSegment.push(this.distance);
		
		}
		
		//speed of the animation. V = D/T
		this.speed = this.distance / this.span;
		
		//Angle that will follow the animation
		this.oldAngle = 0;

		//Counter for the time that has past, everytime the scene gets updated it sums the deltaTime
		this.counter = 0;
		
	};

	//Receives deltaTime from XMLScene
	update(deltaTime){

		this.counter += (deltaTime/1000);

		//Verifies if the counter is still lower than span, if by some chance it goes higher, it will update
		if(this.counter > this.span)
			this.counter = this.span;

		//Gets the current Distance of the object. D = V*T
		this.currentDistance = this.speed * this.counter;

		//Gets the Index for the controlPoints that represent the current situation of the current distance.
		var i = 0; 
		while(this.currentDistance > this.distancesSegment[i] && i < this.distancesSegment.length) i++;

		this.p1 = this.controlPoints[i];
		this.p2 = this.controlPoints[i+1];

		var previousSegment;

		if(i==0) previousSegment = 0;
		else previousSegment = this.distancesSegment[i - 1];

		this.displacement = (this.currentDistance - previousSegment) / (this.distancesSegment[i] - previousSegment);
				
		this.angleRotation = Math.atan((this.p2[0] - this.p1[0]) / (this.p2[2] - this.p1[2]));
		if(isNaN(this.angleRotation)) this.angleRotation = 0;

		if(this.p2[2] - this.p1[2] < 0)
			this.angleRotation += Math.PI;
		
		this.oldAngle = this.angleRotation;

	}

	apply(){
		
		var x = (this.p2[0] - this.p1[0]) * this.displacement + this.p1[0];
		var y = (this.p2[1] - this.p1[1]) * this.displacement + this.p1[1];
		var z = (this.p2[2] - this.p1[2]) * this.displacement + this.p1[2];

		this.scene.translate(x,y,z);
		this.scene.rotate(this.oldAngle, 0, 1, 0);
	}
};