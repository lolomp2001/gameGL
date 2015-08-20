function GameGL() {
	this.ground = new Ground();
	this.character = new Character();
	this.cursor = new DynCursor();
	
	this.ground.initMesh();
	this.ground.initTexture();
	
	this.character.initMesh();
	this.character.initTexture();
	
	this.cursor.initMesh();
	this.cursor.initTexture();
}

GameGL.prototype.draw = function (){
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	this.ground.draw();
	this.character.draw();
	this.cursor.draw();
}

GameGL.prototype.updateCursor = function (){
	this.cursor.moveGroundCursor();
	
}

GameGL.prototype.updateCharacterPosition = function (){
	this.character.setCharacterPosition(this.cursor.iXGridPos, this.cursor.iYGridPos);
}