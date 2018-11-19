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

		this.distance = 0;

		this.distancesSegment = [];

		this.displacement;
		this.angleRotation;
		this.p1;
		this.p2;

		for(var i = 0; i < controlPoints.length - 1; i++){
			this.distance += vec3.dist(vec3.fromValues(controlPoints[i][0], controlPoints[i][1], controlPoints[i][2]), vec3.fromValues(controlPoints[i+1][0], controlPoints[i+1][1], controlPoints[i+1][2]));
			this.distancesSegment.push(this.distance);
		}
		this.speed = this.distance / this.span;
		this.prevAngle = 0;

		this.counter = 0;
		
	};

	update(time){

		this.counter += (time/1000);

		if(this.counter > this.span)
			this.counter = this.span;

		this.currentDistance = this.speed * this.counter;

		var i = 0; 
		while(this.currentDistance > this.distancesSegment[i] && i < this.distancesSegment.length)
			i++;

		this.p1 = this.controlPoints[i];
		this.p2 = this.controlPoints[i+1];


		var lastSegDist;

		if(i==0)
			lastSegDist = 0;
		else
			lastSegDist = this.distancesSegment[i - 1];

		this.displacement = (this.currentDistance - lastSegDist) / (this.distancesSegment[i] - lastSegDist);		
		this.angleRotation = Math.atan((this.p2[0] - this.p1[0]) / (this.p2[2] - this.p1[2]));

		if(this.p2[2] - this.p1[2] < 0)
			this.angleRotation += Math.PI;
		
		this.prevAngle = this.angleRotation;

	}

	apply(){
		this.scene.translate((this.p2[0] - this.p1[0]) * this.displacement + this.p1[0], (this.p2[1] - this.p1[1]) * this.displacement + this.p1[1], (this.p2[2] - this.p1[2]) * this.displacement + this.p1[2]);
		this.scene.rotate(this.prevAngle, 0, 1, 0);
	}
};