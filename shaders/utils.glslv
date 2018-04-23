vec3 rotateX(vec3 v, float a)
{
    return vec3(
        v.x,
        v.y * cos(a) - v.z * sin(a),
        v.z * cos(a) + v.y * sin(a)
    );
}

vec3 rotateY(vec3 v, float a)
{
    return vec3(
        v.x * cos(a) + v.z * sin(a),
        v.y,
        v.z * cos(a) - v.x * sin(a)
    );
}

vec3 rotateZ(vec3 v, float a)
{
    return vec3(
        v.x * cos(a) - v.y * sin(a),
        v.y * cos(a) + v.x * sin(a),
        v.z
    );
}

vec4 internalCalcPos(vec3 worldPos, float rotate, float alter, float zoom)
{
	worldPos = rotateZ(worldPos, radians(rotate));
	worldPos = rotateX(worldPos, radians(alter));
	//worldPos.xy /= 1.0 - worldPos.z;
	worldPos /= 4.0;
	worldPos.z *= 0.5;//0.5;
	//worldPos.xy /= 2.0 - worldPos.z * 2.0;
	//worldPos.xy /= 1.0 - worldPos.z * 0.5;
	worldPos.xy *= zoom;
	
	float w = 1.0 - worldPos.z;
	
	worldPos.z *= 0.05;
	
	return vec4(worldPos, w);
}

vec4 calcPos(vec3 pos, float height, vec2 coord, vec3 offset, float rotate, float alter, float zoom)
{
	vec3 worldPos = pos * vec3(1, 1, height) + vec3(coord, 0) - offset;
	
	return internalCalcPos(worldPos, rotate, alter, zoom);
}

vec4 calcPos2(vec3 pos, float height, vec2 coord, vec3 offset, float rotate, float alter, float zoom)
{
	vec3 worldPos = pos + vec3(coord, height) - offset;
	
	return internalCalcPos(worldPos, rotate, alter, zoom);
}
