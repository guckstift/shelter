uniform vec3 uChar;
uniform vec2 uCoord;
uniform float uRotate;
uniform float uAlter;
uniform float uHeight;
uniform float uZoom;

attribute vec3 aPos;
attribute vec2 aTexCoord;

varying vec2 vTexCoord;
varying float vObj;

void main()
{
	gl_Position = calcPos2(aPos, uHeight, uCoord, uChar, uRotate, uAlter, uZoom);
	
	vTexCoord = aTexCoord;
	vObj = 1.0;
}
