#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D texture;
uniform float textScale;
uniform float timeFactor;

void main(){
	vec4 textureColor = texture2D(texture, vTextureCoord * textScale + timeFactor);
	gl_FragColor = textureColor;
} 