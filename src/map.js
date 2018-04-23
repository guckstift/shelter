import math from "./math.js";
import loader from "./loader.js";
import House from "./house.js";

var mapgenSeed = 18349276;
var terraSeed  = 8319764;
var objSeed    = 31415925;

export default class Map
{
	constructor(display)
	{
		this.mapsize = 16;
		this.rotate  = 45.0;
		this.alter   = -75.0;
		this.zoom    = 1.0;
		this.mobs    = [];
		this.houses  = Array(this.mapsize ** 2);
		this.display = display;
		this.coords  = display.buffer("static", "ubyte", false, this.mapsize ** 2 * 2);
		this.heights = display.buffer("dynamic", "ubyte", false, this.mapsize ** 2);
		this.terra   = display.buffer("static", "ubyte", false, this.mapsize ** 2);
		this.objs    = display.buffer("dynamic", "ubyte", false, this.mapsize ** 2);
		this.pillar  = display.buffer("static", "ubyte", false,
			[0,0,1, 0,1,1, 1,0,1, 1,0,1, 0,1,1, 1,1,1,
			 0,0,0, 0,1,0, 0,0,1, 0,1,1, 0,0,1, 0,1,0,
			 0,0,0, 0,0,1, 1,0,0, 1,0,1, 1,0,0, 0,0,1,
			 0,1,0, 1,1,0, 0,1,1, 1,1,0, 1,1,1, 0,1,1,
			 1,0,0, 1,0,1, 1,1,0, 1,0,1, 1,1,1, 1,1,0]);
		this.colors  = display.buffer("static", "ubyte", false,
			[0, 0, 0, 0, 0, 0,
			 1, 1, 1, 1, 1, 1,
			 2, 2, 2, 2, 2, 2,
			 3, 3, 3, 3, 3, 3,
			 4, 4, 4, 4, 4, 4]);
		
		this.verts   = display.buffer("static", "float", false,
			[0,0.5,0, 1,0.5,0, 0,0.5,1, 1,0.5,1,   1,0.5,1, 0.5,0,0,
			 0.5,0,0, 0.5,1,0, 0.5,0,1, 0.5,1,1]);
		this.texcoords = display.buffer("static", "float", false,
			[0,0, 1,0, 0,1, 1,1,   1,1, 0,0,
			 0,0, 1,0, 0,1, 1,1]);
		
        loader.display(display);
        
        loader.shader(
            ["utils.glslv", "map.glslv"], ["map.glslf"],
            shader => {this.shader = shader}
        );
        
        loader.shader(
            ["utils.glslv", "objs.glslv"], ["obj.glslf"],
            shader => {this.objshader = shader}
        );
        
        loader.texture("tree.png", tex => {this.tree = tex});
        
        loader.ready(() => {this.ready = true});
        
		for(var x=0; x < this.mapsize; x++) {
			for(var y=0; y < this.mapsize; y++) {
				var i = y * this.mapsize + x;
				this.coords.set(i * 2, [x, y]);
				this.heights.set(i * 1, [math.noise2d(x, y, mapgenSeed) * 5]);
				this.terra.set(i * 1, [math.noise2d(x, y, terraSeed) * 3]);
				this.objs.set(i * 1, [math.noise2d(x, y, objSeed) * 2]);
			}
		}
		
		this.setHeight(3, 0, 1);
		
		this.setObj(0,0,0);
	}
	
	linear(x, y)
	{
		var x = math.round(x);
		var y = math.round(y);
		return this.mapsize * y + x;
	}
	
	inrange(x, y)
	{
		var x = math.round(x);
		var y = math.round(y);
		return x >= 0 && x < this.mapsize && y >= 0 && y < this.mapsize;
	}
	
	height(x, y)
	{
		var x = math.round(x);
		var y = math.round(y);
		if(this.inrange(x,y)) {
			return this.heights.data[this.linear(x, y)];
		}
		
		return 0;
	}
	
	obj(x, y)
	{
		var x = math.round(x);
		var y = math.round(y);
		if(this.inrange(x,y)) {
			return this.objs.data[this.linear(x, y)];
		}
		
		return 0;
	}
	
	house(x, y)
	{
		var x = math.round(x);
		var y = math.round(y);
		
		if(this.inrange(x,y)) {
			return this.houses[this.linear(x, y)];
		}
	}
	
	setHeight(x, y, h)
	{
		var x = math.round(x);
		var y = math.round(y);
		if(this.inrange(x,y)) {
			this.heights.set(this.linear(x, y), [h]);
		}
	}
	
	setObj(x, y, o)
	{
		var x = math.round(x);
		var y = math.round(y);
		if(this.inrange(x,y)) {
			this.objs.set(this.linear(x, y), [o]);
		}
	}
	
	putHouse(x, y)
	{
		var x = math.round(x);
		var y = math.round(y);
		
		if(this.house(x, y) === undefined) {
			this.houses[this.linear(x, y)] = new House(this.display, this, [x, y]);
		}
	}
	
	draw()
	{
		if(this.ready) {
			this.shader
				.uChar(this.char.standpoint())
				.uRotate(this.rotate)
				.uAlter(this.alter)
				.uZoom(this.zoom)
				.aPos(this.pillar)
				.aCoord(this.coords, 0, 0, 1)
				.aHeight(this.heights, 0, 0, 1)
				.aColor(this.colors)
				.aTerra(this.terra, 0, 0, 1);
		
			this.display
				.draw("triangles", this.pillar.len / 3, this.heights.len);
			
			this.objshader
				.uChar(this.char.standpoint())
				.uTex(this.tree)
				.uRotate(this.rotate)
				.uAlter(this.alter)
				.uZoom(this.zoom)
				.aPos(this.verts)
				.aTexCoord(this.texcoords)
				.aCoord(this.coords, 0, 0, 1)
				.aHeight(this.heights, 0, 0, 1)
				.aObj(this.objs, 0, 0, 1);
		
			this.display.draw("trianglestrip", 10, this.heights.len);
			
			for(var house of this.houses) {
				if(house) {
					house.draw();
				}
			}
		}
	}
}
