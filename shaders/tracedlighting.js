let vertex = `
precision mediump float;

varying vec2 vUv;
varying vec4 worldCoord;

void main() {
	vUv = uv;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
	worldCoord = modelMatrix * vec4( position, 1.0 );
}
`;

let fragment = `
precision mediump float;

uniform sampler2D texture1;

varying vec2 vUv;
varying vec4 worldCoord;

void main() {
	gl_FragColor = texture2D(texture1, vUv);
	float x = gl_FragCoord.x / gl_FragCoord.w;
	float proportion;

	proportion = x * 0.01;

	// gl_FragColor *= proportion;
	// gl_FragColor.w = 1.0;

	gl_FragColor = vec4(proportion, proportion, proportion, 1.0);
	
	float r,g,b;

	r = abs(worldCoord.x / (320.0 * 8.0));
	while (r > 1.0) r -= 1.0;
	g = abs(worldCoord.y / (320.0 * 1.0));
	while (g > 1.0) g -= 1.0;
	b = abs(worldCoord.z / (320.0 * 8.0));
	while (b > 1.0) b -= 1.0;

	gl_FragColor = vec4(r, g, b, 1.0);
}
`;

export default {
	vertex: vertex, 
	fragment: fragment
}
