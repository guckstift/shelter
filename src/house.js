import Char from "./char.js";
import math from "./math.js";

var verts = undefined;
var texcoords = undefined;

export default class House extends Char
{
	constructor(display, map, pos)
	{
		super(display, map, pos, "house.png", false);
		
		this.input.onKeyDownCB = () => {};
		this.input.onKeyUpCB   = () => {};
		this.inhabited         = false;
		
		var a = 0.05;
		var b = 0.95;
		var c = 0.50;
		var h = 1.75;
		
		this.verts = verts = verts || display.buffer("static", "float", false,
			[a,a,0, a,a,1, b,a,0, b,a,1,  b,a,1, a,b,0,
			 a,b,0, a,b,1, a,a,0, a,a,1,  a,a,1, b,b,0,
			 b,b,0, b,b,1, a,b,0, a,b,1,  a,b,1, b,a,0,
			 b,a,0, b,a,1, b,b,0, b,b,1,  b,b,1, a,a,1,
			 a,a,1, a,c,h, b,a,1, b,c,h,  b,c,h, b,b,1,
			 b,b,1, b,c,h, a,b,1, a,c,h,  ]);
		
		this.texcoords = texcoords = texcoords || display.buffer("static", "float", false,
			[0.00,0.75, 0.00,1.00, 0.25,0.75, 0.25,1.00, 0,0, 0,0,
			 0.25,0.75, 0.25,1.00, 0.50,0.75, 0.50,1.00, 0,0, 0,0,
			 0.50,0.75, 0.50,1.00, 0.75,0.75, 0.75,1.00, 0,0, 0,0,
			 0.75,0.75, 0.75,1.00, 1.00,0.75, 1.00,1.00, 0,0, 0,0,
			 0.00,0.50, 0.00,0.75, 0.25,0.50, 0.25,0.75, 0,0, 0,0,
			 0.25,0.50, 0.25,0.75, 0.50,0.50, 0.50,0.75]);
	}
	
	draw()
	{
		super.draw();
	}
}
