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

		this.span = span;
		this.controlPoints = controlPoints;
	};

	// Returns the angle between 2 points
	getAnglePoints(cp1, cp2){

		// slope = (z2-z1)/(x2-x1)
		var z = cp2[2] - cp1[2];
		var x = cp2[0] - cp1[0];
		var dir = z/x;
		return atan(dir);
	};

	// Returns the distance between 2 points
	getDistancePoints(cp1, cp2){

		var x = pow(cp1[0]-cp2[0], 2);
		var y = pow(cp1[1]-cp2[1], 2);
		var z = pow(cp1[2]-cp2[2], 2);
		return sqrt(x+y+z);
	};

	// Returns the total distance of the whole animation
	getTotalDistance(){

		var distance = 0;
		for(var i = 0; i < (this.controlPoints.length-1); i++){

			distance += this.getDistancePoints(this.controlPoints[i], this.controlPoints[i+1]);
		}

		return distance;
	};

	// Returns the speed of the animation
	getSpeed(){

		var dist = this.getTotalDistance();
		var speed = dist / this.time();
		return speed;
	};

	// Returns an array with the times that must be spended between each 2 controlpoints
	getAnimationTimes(){

		var counter = 0.0;
		var times = [];
		times.push(counter);
		for(var i = 0; i < (this.controlPoints - 1); i++){

			var time = (getDistancePoints(this.controlPoints[i], this.controlPoints[i+1])/getTotalDistance())*this.span;
			counter += time;
			times.push(counter);
		}

		return times;
	};

	update(currentTime){

		if(currentTime <= this.span){

			var times = getAnimationTimes();
			console.log(times);
			for(var k = 0; k < times.length - 1; k++){

				if(currentTime >= times[i] && currentTime < times[i+1]){

					var vector = [];
					vector.push(this.controlPoints[i+1][0] - this.controlPoints[i][0]);
					vector.push(this.controlPoints[i+1][1] - this.controlPoints[i][1]);
					vector.push(this.controlPoints[i+1][2] - this.controlPoints[i][2]);
					vector *= (currentTime - times[i])/(times[i+1]-times[i]);

					//mat4.translate(this.animationMatrix, this.animationMatrix, vector);
					break;
				} else{

					continue;
				}
			}
		}
	};
};