function GameGL() {
	this.ground = new Ground();
	this.character = new Character();
	this.cursor = new DynCursor();
	this.playerInterface = new Interface();
	
	this.ground.initMesh();
	this.ground.initTexture();
	
	this.character.initMesh();
	this.character.initTexture();
	this.character.initPosition()
	
	this.cursor.initMesh();
	this.cursor.initTexture();
	
	this.playerInterface.initMesh();
	this.playerInterface.initTexture();
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
	this.ground.draw();
	this.playerInterface.draw();
	this.cursor.draw();
	this.character.draw();
}

GameGL.prototype.updateCursor = function (){
	this.cursor.moveGroundCursor();
}

GameGL.prototype.updateCharacterPosition = function (){
	this.character.setCharacterPosition(this.cursor.iXGridPos, this.cursor.iYGridPos);
}