function GameGL() {
	this.ground = new Ground();
	this.cursor = new DynCursor();
	
	this.ground.initGroundMesh();
	this.ground.initTexture();
	
	this.cursor.initCursorMesh();
	this.cursor.initTexture();
}

GameGL.prototype.draw = function (){
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	this.ground.draw();
	this.cursor.draw();
}

GameGL.prototype.unpdateCursor = function (){
	this.cursor.moveGroundCursor();
}
