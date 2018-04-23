uniform vec3 uChar;
uniform float uMapSize;
uniform float uRotate;
uniform float uAlter;
uniform float uZoom;

attribute vec3 aPos;
attribute vec2 aTexCoord;
attribute vec2 aCoord;
attribute float aHeight;
attribute float aObj;

varying vec2 vTexCoord;
varying float vObj;

void main()
{
	gl_Position = calcPos2(aPos, aHeight, aCoord, uChar, uRotate, uAlter, uZoom);
	
	vTexCoord = aTexCoord;
	vObj = aObj;
}
