precision highp float;

uniform sampler2D uTex;
uniform float uObj;

varying vec2 vTexCoord;
varying float vObj;

void main()
{
	vec2 texcoord = vTexCoord;
	
	texcoord.y = 1.0 - texcoord.y;
	
	gl_FragColor = texture2D(uTex, texcoord);
	
	if(gl_FragColor.a <= 0.1 || vObj == 0.0) discard;
}
