#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D texture;

//Apenas se quisermos ter um scale da textura e movimentação com o time
uniform float textScale;
uniform float timeFactor;

void main(){
	vec4 textureColor = texture2D(texture, vTextureCoord * textScale + timeFactor);
	gl_FragColor = textureColor;
} 