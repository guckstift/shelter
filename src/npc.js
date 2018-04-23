import Char from "./char.js";
import math from "./math.js";

export default class NPC extends Char
{
	constructor(display, map)
	{
		var pos = [
			math.floor(math.random() * 16),
			math.floor(math.random() * 16),
		];
		
		super(display, map, pos, "npc.png", false);
		
		this.input.onKeyDownCB = () => {};
		this.input.onKeyUpCB   = () => {};
		this.map.char.moveCBs.push(() => this.decide());
	}
	
	decide()
	{
		if(this.moveIn()) {
			return;
		}
		
		var dir = math.floor(math.random() * 4);
		
		for(var i=0; i<4; i++) {
			this.dir = (dir + i) % 4;
			
			if(this.cursorstate() !== "null") {
				break;
			}
		}
		
		this.move();
	}
	
	moveIn()
	{
		for(var i=0; i<4; i++) {
			this.dir = i;
			
			var cursorpos = this.cursorpos();
			var house     = this.map.house(...cursorpos)
			
			if(house && house.inhabited === false) {
				this.pos = cursorpos;
				this.state = "home";
				house.inhabited = true;
				return true;
			}
		}
		
		return false;
	}
}
