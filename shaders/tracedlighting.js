let vertex = `#version 330

layout (std140) uniform Matrices {
	mat4 m_pvm;
	mat4 m_viewModel;
	mat3 m_normal;
};

layout (std140) uniform Lights {
	vec3 l_dir;	// camera space
};

in vec4 position;   // local space
in vec3 normal;	 // local space
in vec2 texCoord;

// the data to be sent to the fragment shader
out Data {
	vec3 normal;
	vec4 eye;
	vec2 texCoord;
} DataOut;

void main () {

	DataOut.normal = normalize(m_normal * normal);
	DataOut.eye = -(m_viewModel * position);
	DataOut.texCoord = texCoord;

	gl_Position = m_pvm * position; 
}
`;

let fragment = `#version 330

layout (std140) uniform Material {
	vec4 diffuse;
	vec4 ambient;
	vec4 specular;
	float shininess;
};

layout (std140) uniform Lights {
	vec3 l_dir;	// camera space
};

in Data {
	vec3 normal;
	vec4 eye;
	vec2 texCoord;
} DataIn;

uniform sampler2D texUnit;

out vec4 colorOut;

void main() {
	vec4 texColor = texture(texUnit, DataIn.texCoord);
	colorOut = textColor;
}
`;

export default {
	vertex: vertex, 
	fragment: fragment
}
