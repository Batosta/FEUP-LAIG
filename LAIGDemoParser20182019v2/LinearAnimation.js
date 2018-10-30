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
		this.lastCurrTime = -1;
	}

	// Returns the angle between 2 points
	getAnglePoints(cp1, cp2){

		// slope = (z2-z1)/(x2-x1)
		var z = cp2[2] - cp1[2];
		var x = cp2[0] - cp1[0];
		var dir = z/x;
		return atan(dir);
	}

	// Returns the distance between 2 points
	getDistancePoints(cp1, cp2){

		var x = pow(cp1[0]-cp2[0], 2);
		var y = pow(cp1[1]-cp2[1], 2);
		var z = pow(cp1[2]-cp2[2], 2);
		return sqrt(x+y+z);
	}

	// Returns the total distance of the whole animation
	getTotalDistance(){

		var distance = 0;
		for(var i = 0; i < (this.controlPoints.length-1); i++){

			distance += this.getDistancePoints(this.controlPoints[i], this.controlPoints[i+1]);
		}

		return distance;
	}

	// Returns the speed of the animation
	getSpeed(){

		var dist = this.getTotalDistance();
		var speed = dist / this.time();
		return speed;
	}

	// Updates the object in function of the time
	update(currTime){
		
		if(this.lastCurrTime != -1){

			var deltaTime = currTime - this.lastCurrTime;
			this.lastCurrTime = currTime;
		}
		this.lastCurrTime = currTime;

		
		
		
	};
};