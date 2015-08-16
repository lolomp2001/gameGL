function GameGL() {
	this.cursor = new DynCursor();
	this.cursor.initCursorMesh();
	this.cursor.initTexture();
}

GameGL.prototype.draw = function (){
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	this.cursor.draw();
}

GameGL.prototype.unpdateCursor = function (){
	this.cursor.moveGroundCursor();
}
