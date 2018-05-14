function DynCursor() {
	this.squareVerticesBuffer;
	this.squareVerticesTextCoorBuffer;
	this.squareVerticesIndexBuffer;
	this.dynCursorCurrentText;
	this.dynCursorTextOK;
	this.dynCursorTextKO;
	this.iXGridPos;
	this.iYGridPos;
}

DynCursor.prototype.initMesh = function (){
	this.squareVerticesBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVerticesBuffer);

	var vertices = [ -MAP_TILE_WIDTH / 2, -MAP_TILE_HEIGHT / 2,
			-MAP_TILE_WIDTH / 2, MAP_TILE_HEIGHT / 2, 
			MAP_TILE_WIDTH / 2,	MAP_TILE_HEIGHT / 2, 
			MAP_TILE_WIDTH / 2, -MAP_TILE_HEIGHT / 2 ];
    
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

	this.squareVerticesBuffer.itemSize = 2;
	this.squareVerticesBuffer.numItems = 4;
	
	this.squareVerticesTextCoorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVerticesTextCoorBuffer);
	
	var textCoord = [ 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0 ];
	
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textCoord), gl.STATIC_DRAW);
	
	this.squareVerticesTextCoorBuffer.itemSize = 2;
	this.squareVerticesTextCoorBuffer.numItems = 4;
	
	this.squareVerticesIndexBuffer = gl.createBuffer();

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.squareVerticesIndexBuffer);
		  
	var indices = [ 0, 1, 2, 0, 2, 3 ];
	
	this.squareVerticesIndexBuffer.numItems = indices.length;

	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices),
			gl.STATIC_DRAW);
}

DynCursor.prototype.draw = function (){
	var yTranslation = this.iYGridPos*0.75*MAP_TILE_HEIGHT;
	var xTranslation = this.iXGridPos*MAP_TILE_WIDTH + (this.iYGridPos & 1)*0.5*MAP_TILE_WIDTH;
	
	gl.uniform2f(translationLocation, xTranslation, yTranslation);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVerticesBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.squareVerticesBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVerticesTextCoorBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.squareVerticesTextCoorBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, this.dynCursorCurrentText);
	gl.uniform1i(samplerUniform, 0);
    
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.squareVerticesIndexBuffer);
    
	gl.drawElements(gl.TRIANGLES, this.squareVerticesIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

DynCursor.prototype.updateTexture = function (itemsArray) {
	var item = {x: this.iXGridPos, y: this.iYGridPos};

	if (Dijkstra.prototype.indexOfItemsArray(itemsArray, item)<0) {
		this.dynCursorCurrentText = this.dynCursorTextOK;
	}

	else {
		this.dynCursorCurrentText = this.dynCursorTextKO;
	}
}

DynCursor.prototype.isClickable = function (itemsArray) {
	var bResult = true;
	var item = {x: this.iXGridPos, y: this.iYGridPos};

	if (Dijkstra.prototype.indexOfItemsArray(itemsArray, item)<0) {
		bResult = true;
	}
	
	else {
		bResult = false;
	}
	
	return bResult;
}

DynCursor.prototype.handleLoadedTexture = function (texture) {
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,	texture.image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.bindTexture(gl.TEXTURE_2D, null);
}

DynCursor.prototype.initTexture = function() {
	this.dynCursorTextOK = this.loadTexture("images/cursorOK.png");
	this.dynCursorCurrentText = this.dynCursorTextOK;
	
	this.dynCursorTextKO = this.loadTexture("images/cursorKO.png");
}

DynCursor.prototype.loadTexture = function(imagePath) {
	var texture = gl.createTexture();
	texture.image = new Image();

	texture.image.onload = function() {
		Character.prototype.handleLoadedTexture(texture);
	}
	
	texture.image.src = imagePath;
	return texture;
}

DynCursor.prototype.moveGroundCursor = function(){
	var SectX =  Math.trunc(mousePos.x / MAP_TILE_WIDTH);
	var SectY = Math.trunc(mousePos.y / (0.75 * MAP_TILE_HEIGHT));
	
	var SectPxlX = (mousePos.x % MAP_TILE_WIDTH);
	var SectPxlY = (mousePos.y % (0.75 * MAP_TILE_HEIGHT));
	new Blob();
	this.iXGridPos = SectX;
	this.iYGridPos = SectY;

	// case 1 : A-Sections (almost one tile in the quad section)
	if ((SectY & 1) == 0) {

		var fGradTile = MAP_TILE_HEIGHT * 0.25 / (MAP_TILE_WIDTH * 0.5);
		// right side
		if (SectPxlX >= (MAP_TILE_WIDTH * 0.5)) {
		// left Edge
			if (SectPxlY < (SectPxlX * fGradTile)) {			
				this.iXGridPos = SectX + 1;
				this.iYGridPos = SectY;
			} 
			
			else {
				this.iXGridPos = SectX;
				this.iYGridPos = SectY + 1;
			}
		}
		
		// left side
		else if (SectPxlX < MAP_TILE_WIDTH * 0.5) {

			if (SectPxlY < (- SectPxlX * fGradTile + MAP_TILE_HEIGHT * 0.5)) {
				this.iXGridPos = SectX;
				this.iYGridPos = SectY;
			}
			
			else {
				this.iXGridPos = SectX;
				this.iYGridPos = SectY + 1;
			}
		}
	}

	// case 2 : B-Sections
	else {

		var fGradTile = MAP_TILE_HEIGHT * 0.25 / (MAP_TILE_WIDTH * 0.5);
		// right side
		if (SectPxlX >= (MAP_TILE_WIDTH * 0.5)) {

			if (SectPxlY < (- SectPxlX * fGradTile + MAP_TILE_HEIGHT * 0.75)) {
				this.iXGridPos = SectX;
				this.iYGridPos = SectY;
			} else {
				this.iXGridPos = SectX + 1;
				this.iYGridPos = SectY + 1;
			}
		}

		// left side
		else if (SectPxlX < MAP_TILE_WIDTH * 0.5) {

			if (SectPxlY < (SectPxlX * fGradTile + MAP_TILE_HEIGHT * 0.25)) {
				this.iXGridPos = SectX;
				this.iYGridPos = SectY;
			} else {
				this.iXGridPos = SectX;
				this.iYGridPos = SectY + 1;
			}
		}
	}
}
