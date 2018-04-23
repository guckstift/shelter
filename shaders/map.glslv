uniform vec3 uChar;
uniform float uMapSize;
uniform float uRotate;
uniform float uAlter;
uniform float uZoom;

attribute vec3 aPos;
attribute vec2 aCoord;
attribute float aHeight;
attribute float aColor;
attribute float aTerra;

varying vec2 vCoord;
varying vec4 vColor;
varying vec3 vPos;
varying float vZ;

void main()
{
	gl_Position = calcPos(aPos, aHeight, aCoord, uChar, uRotate, uAlter, uZoom);
	
	vCoord = aCoord;
	vPos   = aPos;
	vZ     = gl_Position.z;
	
	if(aTerra == 0.0) {
		if(aColor == 0.0) vColor = vec4(0.5, 1.0, 0.0, 1.0);
		if(aColor == 1.0) vColor = vec4(0.25, 0.5, 0.0, 1.0);
		if(aColor == 2.0) vColor = vec4(0.125, 0.25, 0.0, 1.0);
		if(aColor == 3.0) vColor = vec4(0.0625, 0.125, 0.0, 1.0);
		if(aColor == 4.0) vColor = vec4(0.25, 0.5, 0.0, 1.0);
	}
	else if(aTerra == 1.0) {
		if(aColor == 0.0) vColor = vec4(1.0, 1.0,  0.25, 1.0);
		if(aColor == 1.0) vColor = vec4(0.5, 0.5,  0.125, 1.0);
		if(aColor == 2.0) vColor = vec4(0.25, 0.25, 0.0625, 1.0);
		if(aColor == 3.0) vColor = vec4(0.125, 0.125, 0.0625, 1.0);
		if(aColor == 4.0) vColor = vec4(0.5, 0.5, 0.125, 1.0);
	}
	else if(aTerra == 2.0) {
		if(aColor == 0.0) vColor = vec4(0.5, 0.5,  0.5, 1.0);
		if(aColor == 1.0) vColor = vec4(0.25, 0.25,  0.25, 1.0);
		if(aColor == 2.0) vColor = vec4(0.125, 0.125, 0.125, 1.0);
		if(aColor == 3.0) vColor = vec4(0.0625, 0.0625, 0.0625, 1.0);
		if(aColor == 4.0) vColor = vec4(0.25, 0.25, 0.25, 1.0);
	}
}
