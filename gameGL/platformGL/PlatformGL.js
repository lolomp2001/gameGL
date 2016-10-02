function GameGL() {
	this.scenery = new Scenery();
	this.character = new Character();
	
	this.scenery.initMesh();
	this.scenery.initTexture();
	
	this.character.initMesh();
	this.character.initTexture();
	this.character.initPosition(this.gridPosArray);
}

GameGL.prototype.run = function (){
	this.update();
	this.draw();
}

GameGL.prototype.update = function (){
	this.character.updatePosition();
	this.character.updateTexture();
}

GameGL.prototype.draw = function (){
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	this.scenery.draw();
	//this.character.draw();
}
