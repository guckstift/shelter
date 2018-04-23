import Display from "./display.js";
import FrameLoop from "./frameloop.js";
import Input from "./input.js";
import Map from "./map.js";
import Char from "./char.js";
import NPC from "./npc.js";

export default class Game
{
    constructor()
    {
    	this.keys = {};
    	
        addEventListener("load", () => this.onPageLoad());
    }
    
    onPageLoad()
    {
    	this.root = document.createElement("div");
    	this.root.style.width = "600px";
    	this.root.style.height = "600px";
    	this.root.style.position = "relative";
    	this.root.style.margin = "auto";
    	this.root.style.borderRadius = "16px";
    	
    	document.body.appendChild(this.root);
    	document.body.style.backgroundColor = "rgb(0, 0, 16)";
    	
        this.display = new Display({antialias: false, alpha: false}, true);
        this.display.resize(600, 600);
        this.display.appendTo(this.root);
        this.display.setClearColor(0, 0, 0.125, 1);
    	this.display.canvas.style.borderRadius = "16px";
        
        var gl = this.display.gl;
        
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.GREATER);
        gl.clearDepth(-1.0);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    	
    	this.movesLabel = document.createElement("div");
    	this.movesLabel.style.position = "absolute";
    	this.movesLabel.style.top = "16px";
    	this.movesLabel.style.left = "16px";
    	this.movesLabel.style.color = "#006";
    	this.movesLabel.style.fontSize = "2em";
    	this.movesLabel.style.fontFamily = "sans-serif";
    	this.movesLabel.style.textShadow = "#fff 0 0 8px, #fff 0 0 8px";
    	this.movesLabel.onmouseover = () => {
    		this.helpLabel.style.display = "block";
    		this.helpLabel.innerText = "Moves made so far";
    	};
    	this.movesLabel.onmouseout = () => {this.helpLabel.style.display = "none"};

    	this.root.appendChild(this.movesLabel);
    	
    	this.woodLabel = document.createElement("div");
    	this.woodLabel.style.position = "absolute";
    	this.woodLabel.style.top = "16px";
    	this.woodLabel.style.right = "16px";
    	this.woodLabel.style.width = "64px";
    	this.woodLabel.style.height = "64px";
    	this.woodLabel.style.textAlign = "center";
    	this.woodLabel.style.color = "#006";
    	this.woodLabel.style.fontSize = "2em";
    	this.woodLabel.style.fontFamily = "sans-serif";
    	this.woodLabel.style.textShadow = "#fff 0 0 8px, #fff 0 0 8px";
    	this.woodLabel.style.backgroundImage = "url('gfx/wood.png')";
    	this.woodLabel.innerText = "0";
    	this.woodLabel.onmouseover = () => {
    		this.helpLabel.style.display = "block";
    		this.helpLabel.innerText = "Wood logs collected";
    	};
    	this.woodLabel.onmouseout = () => {this.helpLabel.style.display = "none"};

    	this.root.appendChild(this.woodLabel);
    	
    	this.blockLabel = this.woodLabel.cloneNode(true);
    	this.blockLabel.style.top = "96px";
    	this.blockLabel.style.backgroundImage = "url('gfx/block.png')";
    	this.blockLabel.innerText = "0";
    	this.blockLabel.onmouseover = () => {
    		this.helpLabel.style.display = "block";
    		this.helpLabel.innerText = "Blocks of soil collected";
    	};
    	this.blockLabel.onmouseout = () => {this.helpLabel.style.display = "none"};

    	this.root.appendChild(this.blockLabel);
    	
    	this.buildBtn = document.createElement("button");
    	this.buildBtn.style.position = "absolute";
    	this.buildBtn.style.top = "176px";
    	this.buildBtn.style.right = "16px";
    	this.buildBtn.style.width = "64px";
    	this.buildBtn.style.height = "64px";
    	this.buildBtn.style.textAlign = "center";
    	this.buildBtn.style.color = "#006";
    	this.buildBtn.style.fontSize = "2em";
    	this.buildBtn.style.fontFamily = "sans-serif";
    	this.buildBtn.style.textShadow = "#fff 0 0 8px, #fff 0 0 8px";
    	this.buildBtn.style.backgroundImage = "url('gfx/build.png')";
    	this.buildBtn.style.borderRadius = "4px";
    	this.buildBtn.onclick = () => this.build();
    	this.buildBtn.onmouseover = () => {
    		this.helpLabel.style.display = "block";
    		this.helpLabel.innerText = "Build a new house at your cursor";
    	};
    	this.buildBtn.onmouseout = () => {this.helpLabel.style.display = "none"};

    	this.root.appendChild(this.buildBtn);
    	
    	this.raiseBtn = this.buildBtn.cloneNode(true);
    	this.raiseBtn.style.top = "256px";
    	this.raiseBtn.style.backgroundImage = "url('gfx/block.png')";
    	this.raiseBtn.onclick = () => this.raise();
    	this.raiseBtn.onmouseover = () => {
    		this.helpLabel.style.display = "block";
    		this.helpLabel.innerText = "Raise the terrain at your cursor";
    	};
    	this.raiseBtn.onmouseout = () => {this.helpLabel.style.display = "none"};
    	
    	this.root.appendChild(this.raiseBtn);
    	
    	this.sinkBtn = this.buildBtn.cloneNode(true);
    	this.sinkBtn.style.top = "336px";
    	this.sinkBtn.style.backgroundImage = "url('gfx/pickaxe.png')";
    	this.sinkBtn.onclick = () => this.sink();
    	this.sinkBtn.onmouseover = () => {
    		this.helpLabel.style.display = "block";
    		this.helpLabel.innerText = "Ablate the terrain at your cursor";
    	};
    	this.sinkBtn.onmouseout = () => {this.helpLabel.style.display = "none"};
    	
    	this.root.appendChild(this.sinkBtn);
    	
    	this.cutBtn = this.buildBtn.cloneNode(true);
    	this.cutBtn.style.top = "416px";
    	this.cutBtn.style.backgroundImage = "url('gfx/axe.png')";
    	this.cutBtn.onclick = () => this.cut();
    	this.cutBtn.onmouseover = () => {
    		this.helpLabel.style.display = "block";
    		this.helpLabel.innerText = "Cut a tree at your cursor";
    	};
    	this.cutBtn.onmouseout = () => {this.helpLabel.style.display = "none"};
    	
    	this.root.appendChild(this.cutBtn);
    	
    	this.helpLabel = document.createElement("div");
    	this.helpLabel.style.display = "none";
    	this.helpLabel.style.position = "absolute";
    	this.helpLabel.style.bottom = "0";
    	this.helpLabel.style.right = "0";
    	this.helpLabel.style.left = "0";
    	this.helpLabel.style.color = "#fff";
    	this.helpLabel.style.fontSize = "1.5em";
    	this.helpLabel.style.padding = "0.5em";
    	this.helpLabel.style.fontFamily = "sans-serif";
    	this.helpLabel.style.backgroundColor = "rgba(0,0,0,0.5)";
    	this.helpLabel.innerText = "";
    	this.helpLabel.style.borderRadius = "16px";

    	this.root.appendChild(this.helpLabel);
        
        this.input = new Input(this.display.canvas);
        this.input.setOnMouseMove(() => this.onMouseMove());
        this.input.setOnMouseDown(() => this.onMouseDown());
        this.input.setOnMouseUp(() => this.onMouseUp());
        this.input.setOnMouseWheel(d => this.onMouseWheel(d));
        this.input.setOnKeyDown(k => this.onKeyDown(k));
        this.input.setOnKeyUp(k => this.onKeyUp(k));
        
        this.map  = new Map(this.display);
        this.char = new Char(this.display, this.map);
        this.map.char = this.char;
        
        this.npcs = [];
        
        for(var i=0; i<10; i++) {
	        this.npcs.push(new NPC(this.display, this.map));
        }
        
        this.loop = new FrameLoop();
        this.loop.frame(() => this.frame());
        this.loop.start();
    }
    
    build()
    {
    	if(this.char.woods >= 4 && this.char.cursorstate() === "move") {
    		this.map.putHouse(...this.char.cursorpos());
    		this.char.woods -= 4;
			this.char.moves++;
			this.char.moveNotify();
    	}
    }
    
    raise()
    {
		var cursorpos = this.char.cursorpos();
		
		this.map.setHeight(...cursorpos, this.map.height(...cursorpos) + 1);
		this.char.blocks--;
		this.char.moves++;
		this.char.moveNotify();
    }
    
    sink()
    {
		var cursorpos = this.char.cursorpos();
		
		this.map.setHeight(...cursorpos, this.map.height(...cursorpos) - 1);
		this.char.blocks++;
		this.char.moves++;
		this.char.moveNotify();
    }
    
    cut()
    {
    	this.char.move();
    }
    
    frame()
    {
    	this.char.update();
    	
        for(var i=0; i<10; i++) {
	        this.npcs[i].update();
    	}
    	
    	var gl = this.display.gl;
    	
    	gl.clear(gl.DEPTH_BUFFER_BIT);
    	
    	/*
    	if(this.keys.a) {
			this.map.rotate ++;
		}
		if(this.keys.d) {
			this.map.rotate --;
		}
    	if(this.keys.w) {
			this.map.alter ++;
			if(this.map.alter > -10) this.map.alter = -10;
		}
		if(this.keys.s) {
			this.map.alter --;
			if(this.map.alter < -75) this.map.alter = -75;
		}
		*/
		if(this.keys.q) {
			this.map.zoom *= 1.0325;
			if(this.map.zoom > 4) this.map.zoom = 4;
		}
		if(this.keys.e) {
			this.map.zoom /= 1.0325;
			if(this.map.zoom < 0.5) this.map.zoom = 0.5;
		}
    	 
        this.display.clear();
        gl.clear(gl.DEPTH_BIT);
        gl.enable(gl.DEPTH_TEST);
        
        this.map.draw();
        this.char.draw();
    	
        for(var i=0; i<10; i++) {
        	this.npcs[i].draw();
        }
        
    	this.movesLabel.innerText = "Moves: " + this.char.moves;
    	this.woodLabel.innerText = this.char.woods;
    	this.woodLabel.style.opacity = this.char.woods === 0 ? "0.25" : "1.0";
    	this.blockLabel.innerText = this.char.blocks;
    	this.blockLabel.style.opacity = this.char.blocks === 0 ? "0.25" : "1.0";
    	
    	var charReady = this.char.state === "null";
		var cursorpos = this.char.cursorpos();
		
		if(charReady && this.char.woods >= 4) {
			this.buildBtn.style.opacity = "1.0";
			this.buildBtn.disabled = "";
		}
		else {
			this.buildBtn.style.opacity = "0.25";
			this.buildBtn.disabled = "true";
		}
		
		var cursorpos = this.char.cursorpos();
		
		if(charReady && this.map.inrange(...cursorpos) && this.char.isfree()
			&& this.char.blocks > 0
		) {
			this.raiseBtn.style.opacity = "1.0";
			this.raiseBtn.disabled = "";
		}
		else {
			this.raiseBtn.style.opacity = "0.25";
			this.raiseBtn.disabled = "true";
		}
		
		if(charReady && this.map.inrange(...cursorpos) && this.char.isfree()
			&& this.map.height(...cursorpos) > 0
		) {
			this.sinkBtn.style.opacity = "1.0";
			this.sinkBtn.disabled = "";
		}
		else {
			this.sinkBtn.style.opacity = "0.25";
			this.sinkBtn.disabled = "true";
		}
		
		if(charReady && this.char.cursorstate() === "axe") {
			this.cutBtn.style.opacity = "1.0";
			this.cutBtn.disabled = "";
		}
		else {
			this.cutBtn.style.opacity = "0.25";
			this.cutBtn.disabled = "true";
		}
    }
	
	onMouseMove(input)
	{
		if(this.panning) {
			this.map.rotate += this.input.mouseRel[0] / 8;
			this.map.alter += this.input.mouseRel[1] / 8;
			
			if(this.map.alter > -10) this.map.alter = -10;
			if(this.map.alter < -75) this.map.alter = -75;
		}
	}
	
	onMouseDown(input)
	{
		if(this.input.lmb) {
			this.panning = true;
			this.input.lockPointer();
		}
	}
	
	onMouseUp(input)
	{
		if(this.panning) {
			this.panning = false;
			this.input.unlockPointer();
		}
	}
	
	onMouseWheel(delta)
	{
		if(delta < 0) {
			this.map.zoom *= 1.125;
		}
		else {
			this.map.zoom /= 1.125;
		}
		
		if(this.map.zoom > 4) this.map.zoom = 4;
		if(this.map.zoom < 0.5) this.map.zoom = 0.5;
	}
	
	onKeyDown(k)
	{
		this.keys[k] = true;
	}
	
	onKeyUp(k)
	{
		this.keys[k] = false;
	}
}
