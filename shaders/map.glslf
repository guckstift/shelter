precision highp float;

uniform float uMapSize;

varying vec2 vCoord;
varying vec4 vColor;
varying vec3 vPos;
varying float vZ;

void main()
{
	//gl_FragColor = vec4(vCoord / uMapSize, 0, 1);
	gl_FragColor = vColor;
	
	//vec3 fpos = fract(vPos);
	vec3 fpos = mod(vPos, 2.0);
	
	gl_FragColor.rgb = gl_FragColor.rgb * dot(fpos,fpos) * 0.25 + gl_FragColor.rgb * 0.5;
	//gl_FragColor.rgb *= 0.6 - vZ * 0.8;
}
