#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D uTexture;
uniform sampler2D uMask;

void main() {
    
    vec4 textureColor;

    if(texture2D(uMask, vTextureCoord).r < 0.2){
        textureColor = texture2D(uTexture, vTextureCoord);
    }
    else{
        textureColor = texture2D(uMask, vTextureCoord);
    }

    gl_FragColor = textureColor;
}
 