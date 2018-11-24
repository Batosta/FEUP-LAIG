uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aVertexNormal;
varying vec2 vTextureCoord;

uniform sampler2D height;
uniform float normScale;
uniform float timeFactor;

varying vec4 normal;
varying vec4 coords;

void main(){

	vTextureCoord = aTextureCoord;

	vec3 newPos = vec3(aVertexPosition.x, aVertexPosition.y + texture2D(height, aTextureCoord)[1] * 0.2 * normScale, aVertexPosition.z);

	gl_Position = uPMatrix * uMVMatrix * vec4(newPos, 1.0) * timeFactor;

    normal = vec4(aVertexNormal, 1.0);

    coords = vec4(newPos,1.0) / 10.0;
}