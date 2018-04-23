import math from "./math.js";
import loader from "./loader.js";
import Input from "./input.js";

export default class Char
{
	constructor(display, map, pos = [0, 0], gfx = "char.png", cursor = true)
	{
		var charoffs = 0.0625;
		
		this.display = display;
		this.map     = map;
		this.input   = new Input(this.display.canvas);;
		this.pos     = pos;
		this.cursor  = cursor;
		this.dir     = 0;
		this.moves   = 0;
		this.woods   = 0;
		this.blocks  = 0;
		this.state   = "null";
		this.way     = 0;
		this.moveto  = this.pos;
		this.movefrm = this.pos;
		this.fromheight = this.height();
		this.toheight   = this.height();
		this.moveCBs  = [];
		this.map.mobs.push(this);
		
		this.verts   = Char.verts = Char.verts || display.buffer("static", "float", false,
			[0,0.5,0, 1,0.5,0, 0,0.5,1, 1,0.5,1,   1,0.5,1, 0.5,0,0,
			 0.5,0,0, 0.5,1,0, 0.5,0,1, 0.5,1,1]);
		
		this.texcoords = Char.texcoords = Char.texcoords || display.buffer("static", "float", false,
			[0,0, 1,0, 0,1, 1,1,   1,1, 0,0,
			 0,0, 1,0, 0,1, 1,1]);
		
		this.arrow   = Char.arrow = Char.arrow || display.buffer("static", "float", false,
			[0,0,charoffs, 1,0,charoffs, 0,1,charoffs, 1,1,charoffs]);
		
        this.input.setOnKeyUp(k => this.onKeyUp(k));
		
        loader.display(display);
        
        loader.shader(
            ["utils.glslv", "obj.glslv"], ["obj.glslf"],
            shader => {this.shader = shader}
        );
        
        loader.texture(gfx, tex => {this.tex = tex});
        loader.texture("arrow.png", tex => {this.arrtex = tex});
        loader.texture("arrow2.png", tex => {this.arrtex2 = tex});
        loader.texture("pickaxe.png", tex => {this.pickaxe = tex});
        loader.texture("nope.png", tex => {this.nope = tex});
        loader.texture("block.png", tex => {this.block = tex});
        loader.texture("axe.png", tex => {this.axe = tex});
        
        loader.ready(() => {this.ready = true});
	}
	
	cursorpos()
	{
		switch(this.dir) {
			case 0: return [this.pos[0], this.pos[1] + 1];
			case 1: return [this.pos[0] + 1, this.pos[1]];
			case 2: return [this.pos[0], this.pos[1] - 1];
			case 3: return [this.pos[0] - 1, this.pos[1]];
		}
	}
	
	height()
	{
		return this.map.height(...this.pos);
	}
	
	reachable()
	{
		var cursorpos = this.cursorpos();
		var height = this.height();
		var cursorheight = this.map.height(...cursorpos);
		
		return cursorheight <= height + 1 && cursorheight >= height - 1;
	}
	
	isfree()
	{
		var cursorpos = this.cursorpos();
		
		for(var i=0; i<this.map.mobs.length; i++) {
			var mob = this.map.mobs[i];
			
			if(mob.pos[0] === cursorpos[0] && mob.pos[1] === cursorpos[1]
			|| mob.state === "moving"
				&& mob.moveto[0] === cursorpos[0] && mob.moveto[1] === cursorpos[1]
			) {
				return false;
			}
		}
		
		return this.map.obj(...cursorpos) === 0;
	}
	
	cursorstate()
	{
		var cursorpos = this.cursorpos();
		var height = this.map.height(...this.pos);
		var cursorheight = this.map.height(...cursorpos);
		
		if(this.state === "null") {
			if(0) {}
			else if(cursorheight > height + 1 && this.map.inrange(...cursorpos)
				&& this.isfree()
			) {
				return "pickaxe";
			}
			else if(cursorheight < height - 1 && this.map.inrange(...cursorpos)
				&& this.isfree() && this.blocks > 0
			) {
				return "block";
			}
			else if(this.reachable() && this.map.obj(...cursorpos) === 1) {
				return "axe";
			}
			else if(this.reachable() && this.isfree() && this.map.inrange(...cursorpos)) {
				return "move";
			}
		}
		
		return "null";
	}
	
	move()
	{
		var cursorstate = this.cursorstate();
		var cursorpos = this.cursorpos();
		
		if(cursorstate === "move") {
			this.moveForward();
		}
		else if(cursorstate === "pickaxe") {
			this.map.setHeight(...cursorpos, this.map.height(...cursorpos) - 1);
			this.blocks++;
		}
		else if(cursorstate === "block") {
			this.map.setHeight(...cursorpos, this.map.height(...cursorpos) + 1);
			this.blocks--;
		}
		else if(cursorstate === "axe") {
			this.map.setObj(...cursorpos, 0);
			this.woods++;
		}
		else {
			return;
		}
		
		this.moves++;
		this.moveNotify();
	}
	
	moveNotify()
	{
		for(var cb of this.moveCBs) {
			cb();
		}
	}
	
	moveForward()
	{
		if(this.state === "null") {
			this.state   = "moving";
			this.movefrm = this.pos;
			this.moveto  = this.cursorpos();
			this.way     = 0;
			this.fromheight = this.map.height(...this.movefrm);
			this.toheight   = this.map.height(...this.moveto);
		}
	}
	
	onKeyUp(k)
	{
		if(this.state === "null") {
			//if(k === "ArrowRight") {
			if(k === "d") {
				this.dir = (this.dir + 1) % 4;
			}
			//else if(k === "ArrowLeft") {
			else if(k === "a") {
				this.dir = math.mod(this.dir - 1, 4);
			}
			//else if(k === "ArrowUp") {
			else if(k === "w") {
				this.move();
			}
		}
	}
	
	standpoint()
	{
		return [
			this.pos[0] + 0.5, 
			this.pos[1] + 0.5, 
			this.map.height(...this.pos) + 0.5 + this.heightoffs(),
		];
	}
	
	heightoffs()
	{
		if(this.state === "moving") {
			return (
				math.linearMix(this.fromheight, this.toheight, this.way)
				- this.map.height(...this.pos)
				+ (this.fromheight != this.toheight ? 1 - (this.way * 2 - 1) ** 2 : 0)
			);
		}
		
		return 0;
	}
	
	update()
	{
		if(this.state === "moving") {
			this.pos = [
				this.movefrm[0] * (1 - this.way) + this.moveto[0] * this.way,
				this.movefrm[1] * (1 - this.way) + this.moveto[1] * this.way,
			];
			
			if(this.fromheight !== this.toheight) {
				this.way += 0.035;
			}
			else {
				this.way += 0.05;
			}
			
			if(this.way >= 1) {
				this.pos = this.moveto;
				this.state = "null";
				this.way = 0;
			}
		}
	}
	
	draw()
	{
		var gl = this.display.gl;
		
		if(this.ready) {
			this.shader
				.uChar(this.map.char.standpoint())
				.uTex(this.tex)
				.uCoord(this.pos)
				.uRotate(this.map.rotate)
				.uAlter(this.map.alter)
				.uHeight(this.map.height(...this.pos) + this.heightoffs())
				.uZoom(this.map.zoom)
				.aPos(this.verts)
				.aTexCoord(this.texcoords);
		
			this.display.draw("trianglestrip", this.verts.len / 3);
			
			if(this.cursor) {
				var cursorpos = this.cursorpos();
				var cursorstate = this.cursorstate();
			
				this.shader
					.uCoord(cursorpos)
					.uHeight(this.map.height(...cursorpos))
					.aPos(this.arrow)
					.aTexCoord(this.texcoords);
			
				if(cursorstate === "move") {
					this.shader.uTex(this.arrtex);
					this.display.draw("trianglestrip", 4);
				
					gl.disable(gl.DEPTH_TEST);
					this.shader.uTex(this.arrtex2);
					this.display.draw("trianglestrip", 4);
					gl.enable(gl.DEPTH_TEST);
				}
				else if(cursorstate === "pickaxe") {
					gl.disable(gl.DEPTH_TEST);
					this.shader.uTex(this.pickaxe);
					this.display.draw("trianglestrip", 4);
					this.shader.uTex(this.arrtex2);
					this.display.draw("trianglestrip", 4);
					gl.enable(gl.DEPTH_TEST);
				}
				else if(cursorstate === "axe") {
					gl.disable(gl.DEPTH_TEST);
					this.shader.uTex(this.axe);
					this.display.draw("trianglestrip", 4);
					this.shader.uTex(this.arrtex2);
					this.display.draw("trianglestrip", 4);
					gl.enable(gl.DEPTH_TEST);
				}
				else if(cursorstate === "block") {
					gl.disable(gl.DEPTH_TEST);
					this.shader.uTex(this.block);
					this.display.draw("trianglestrip", 4);
					this.shader.uTex(this.arrtex2);
					this.display.draw("trianglestrip", 4);
					gl.enable(gl.DEPTH_TEST);
				}
				else if(cursorstate === "null") {
					gl.disable(gl.DEPTH_TEST);
					this.shader.uTex(this.nope);
					this.display.draw("trianglestrip", 4);
					gl.enable(gl.DEPTH_TEST);
				}
			}
		}
	}
}
