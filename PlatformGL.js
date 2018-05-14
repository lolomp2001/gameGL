function GameGL() {
	this.character = new Character();
	this.character.initMesh();
	this.character.initTexture();
	this.character.initPosition(CHAR_INIT_POSX, CHAR_INIT_POSY);
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
	this.character.draw();
}
