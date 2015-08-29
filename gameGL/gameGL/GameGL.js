function GameGL() {
	this.iGridPosArray;
	this.builder = new Builder();
	this.ground = new Ground();
	//this.character = new Character();
	//this.cursor = new DynCursor();
	this.statCursor = new StatCursor();
	this.playerInterface = new Interface();
	
	this.ground.initMesh();
	this.ground.initTexture();
	
//	this.character.initMesh();
//	this.character.initTexture();
//	this.character.initPosition()
	
	//this.cursor.initMesh();
	//this.cursor.initTexture();

	this.statCursor.initMesh();
	this.statCursor.initTexture();
	
	this.playerInterface.initMesh();
	this.playerInterface.initTexture();
}

GameGL.prototype.run = function (){
	this.update();
	this.draw();
}

GameGL.prototype.update = function (){
	//this.character.updatePosition();
	//this.character.updateTexture();
}

GameGL.prototype.draw = function (){
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	this.ground.draw();
	this.playerInterface.draw();
	//this.cursor.draw();
	this.statCursor.draw();
	this.statCursor.drawArray();
	//this.character.draw();
}

GameGL.prototype.updateCursor = function (){
	//this.cursor.moveGroundCursor();
	this.statCursor.moveGroundCursor();
}

GameGL.prototype.click = function (){
	this.statCursor.addPosition();
}

GameGL.prototype.updateCharacterPosition = function (){
	//this.character.setCharacterPosition(this.cursor.iXGridPos, this.cursor.iYGridPos);
}

GameGL.prototype.keydown = function (evt){
	if (evt.keyCode == 69) {
		var arrayData = this.statCursor.exportGridPosArray();
		this.builder.exportData(arrayData);
	}

	if (evt.keyCode == 76) {
		this.iGridPosArray = this.builder.loadData("mapData.raw");
		this.statCursor.setGridPosArray(this.iGridPosArray);
	}
}