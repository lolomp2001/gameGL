function GameGL() {
	this.gridPosArray;
	this.bMouseOnInterface = false;
	this.ground = new Ground();
	this.scenery = new Scenery();
	this.character = new Character();
	this.cursor = new DynCursor();
	this.interfaceCursor = new InterfaceCursor();
	this.playerInterface = new Interface();
	
	this.loadData();
	
	this.ground.initMesh();
	this.ground.initTexture();
	
	this.scenery.initMesh();
	this.scenery.initTexture();
	
	this.character.initMesh();
	this.character.initTexture();
	this.character.initPosition(this.gridPosArray);
	
	this.cursor.initMesh();
	this.cursor.initTexture();
	
	this.interfaceCursor.initMesh();
	this.interfaceCursor.initTexture();
	
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
	this.scenery.draw();

	if (!this.bMouseOnInterface) {
		this.cursor.draw();
	}
	
	this.character.draw();
	this.playerInterface.draw();
	
	if (this.bMouseOnInterface) {
		this.interfaceCursor.draw();
	}
}

GameGL.prototype.mouseMove = function (){
	this.updateCursor();
	this.bMouseOnInterface = this.mouseOnInterface();
}

GameGL.prototype.updateCursor = function (){
	this.cursor.moveGroundCursor();
	this.cursor.updateTexture(this.gridPosArray);
}

GameGL.prototype.mouseOnInterface = function (){
	var rectInterface = this.playerInterface.getInterfaceRect();
	var bMouseOnInterface = false;
	if (mousePos.x<rectInterface.xMax && mousePos.x>rectInterface.xMin && mousePos.y<rectInterface.yMax && mousePos.y>rectInterface.yMin) {
		bMouseOnInterface = true;
	}
	
	else {
		bMouseOnInterface = false;
	}
	
	return bMouseOnInterface;
}

GameGL.prototype.click = function (){
	if (this.cursor.isClickable(this.gridPosArray)) {
		this.updateCharacterPosition();
	}
}

GameGL.prototype.updateCharacterPosition = function (){
	this.character.setCharacterPosition(this.cursor.iXGridPos, this.cursor.iYGridPos, this.gridPosArray);
}

GameGL.prototype.loadData = function () {
	var xhr = new XMLHttpRequest();
	xhr.open("GET","data/mapData.raw", false);
	xhr.send(null);
	var serializedArr = xhr.responseText;
	this.gridPosArray = JSON.parse(serializedArr);
}