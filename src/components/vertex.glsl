varying vec2 vUv;
varying vec3 vNormal;
varying vec3 translated;

// pass in seperation value from code
// this is the value that will be used to move the vertices outward
uniform float seperation;
uniform float opacity;

void main() {
   
    // glsl is interesting, or rather gpu programming is interesting...
    // screw that its annoying lol
    // glsl is a bit like c, but not really

     // pass to fragment shader
    vUv = uv;
    vNormal = normal;



    // Move each vertex outward along its vNormal, maintaining the same size
    translated = position + vNormal * seperation;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(translated, 1.0);
}
