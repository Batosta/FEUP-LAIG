uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aVertexNormal;

varying vec2 vTextureCoord;

uniform sampler2D uHeightMap;
uniform sampler2D uMask;

uniform float normScale;

void main(){

	vec4 vertex;

    if(texture2D(uMask, aTextureCoord).r < 0.2){
        vertex = vec4(aVertexPosition.x, aVertexPosition.y + texture2D(uHeightMap, aTextureCoord).r * normScale, aVertexPosition.z, 1.0);
    } else
        vertex = vec4(aVertexPosition + vec3(0.0, normScale/2.0, 0.0), 1.0);

    gl_Position = uPMatrix * uMVMatrix * vertex;

    vTextureCoord = aTextureCoord;
}