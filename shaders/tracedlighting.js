let vertex = `
precision mediump float;

varying vec2 vUv;

void main() {
	vUv = uv;

	gl_Position =   projectionMatrix * 
					modelViewMatrix * 
					vec4(position,1.0);
}
`;

let fragment = `
precision mediump float;

uniform sampler2D texture1;

varying vec2 vUv;

void main() {
	gl_FragColor = texture2D(texture1, vUv); // Displays Nothing
	//gl_FragColor = vec4(0.5, 0.2, 1.0, 1.0); // Works; Displays Flat Color
}
`;

export default {
	vertex: vertex, 
	fragment: fragment
}
