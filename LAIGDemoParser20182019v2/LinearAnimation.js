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

		this.linearMatrix = mat4.create();
		
		//this.lastTime = 0;
	};

	// Returns the angle between 2 points
	getAnglePoints(cp1, cp2){

		// slope = (z2-z1)/(x2-x1)
		var z = cp2[2] - cp1[2];
		var x = cp2[0] - cp1[0];
		var dir = z/x;
		return Math.atan(dir);
	};

	// Returns the distance between 2 points
	getDistancePoints(cp1, cp2){

		var x = Math.pow(cp1[0]-cp2[0], 2);
		var y = Math.pow(cp1[1]-cp2[1], 2);
		var z = Math.pow(cp1[2]-cp2[2], 2);
		return Math.sqrt(x+y+z);
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
		var speed = dist / this.span;
		return speed;
	};

	// Returns an array with the times that must be spended between each 2 controlpoints
	getAnimationTimes(){

		var counter = 0.0;
		var times = [];
		times.push(counter);

		for(var i = 0; i < (this.controlPoints.length-1); i++){

			var time = (this.getDistancePoints(this.controlPoints[i], this.controlPoints[i+1])/this.getTotalDistance())*this.span;
			counter += time;
			times.push(counter);
		}
		return times;
	};

	interpolation(c1, c2, percentage){

		//P = (P2 - P1)*(currTime/span) Interpolation

		var interpol = [];

		var x = (c2[0] - c1[0])*percentage;
		var y = (c2[1] - c2[1])*percentage;
		var z = (c2[2] - c2[2])*percentage;

		interpol.push(x,y,z);
		
		return interpol;

	};

	update(currTime){

		currTime = currTime/1000;

		this.lastTime = this.lastTime || 0;
		this.deltaTime = currTime - this.lastTime;
		this.lasTtime = currTime; 

		console.log("LASTTIME" + this.lasTtime + "   DELTATIME   " +this.deltaTime + "LASTTIME" + this.lasTtime);

		//if(this.deltaTime <= this.span){

			var times = this.getAnimationTimes();

			//console.log("TIMES:"); console.log(times);

		for(var i = 0; i < times.length; i++){

			if(i < 2){

				//if(this.deltaTime >= times[i] && this.deltaTime < times[i+1]){

					console.log("ENTREI CÁ DENTRO");

					var percentage = this.deltaTime/times[i];
					//console.log("PERCENTAGE" + percentage);
	
					console.log(this.controlPoints[i]);

					var P = this.interpolation(this.controlPoints[i], this.controlPoints[i+1], percentage);
					console.log(P);
			
					
					mat4.translate(this.linearMatrix, this.linearMatrix, vec3.fromValues(P[0], P[1], P[2]));
					//console.log("MATRIX" + this.linearMatrix);

					

				//	break;
				//}else{
				//	continue;
				//}
			}
		}
		//}
	};

	apply(){
		this.scene.multMatrix(this.linearMatrix);
	};

};