uniform float time;
uniform vec3 colour;
varying vec2 vUv;
varying vec3 vNormal;
uniform float opacity;
uniform sampler2D texture1;

float intensity;


void main() {
    vec4 texel = texture2D(texture1, vUv);
    vec3 color = texel.rgb;

    intensity = 1.0;
    gl_FragColor =  vec4(color,opacity);
}