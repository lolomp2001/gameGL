function DynCursor() {
	this.squareVerticesBuffer;
	this.squareVerticesTestCoorBuffer;
	this.dynCursorText;
	this.iXGridPos;
	this.iYGridPos;
}

DynCursor.prototype.initCursorMesh = function (){
	this.squareVerticesBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVerticesBuffer);

	var vertices = [ -MAP_TILE_WIDTH / 2, -MAP_TILE_HEIGHT / 2, 0.0,
			MAP_TILE_WIDTH / 2, -MAP_TILE_HEIGHT / 2, 0.0, 
			MAP_TILE_WIDTH / 2,	MAP_TILE_HEIGHT / 2, 0.0, 
			-MAP_TILE_WIDTH / 2, -MAP_TILE_HEIGHT / 2, 0.0, 
			-MAP_TILE_WIDTH / 2, MAP_TILE_HEIGHT / 2, 0.0, 
			MAP_TILE_WIDTH / 2, MAP_TILE_HEIGHT / 2, 0.0, ];
    
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

	this.squareVerticesBuffer.itemSize = 3;
	this.squareVerticesBuffer.numItems = 6;
	
	this.squareVerticesTestCoorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVerticesTestCoorBuffer);
	
	var textCoord = [ 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0 ];
	
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textCoord), gl.STATIC_DRAW);
	
	this.squareVerticesTestCoorBuffer.itemSize = 2;
	this.squareVerticesTestCoorBuffer.numItems = 6;

}

DynCursor.prototype.draw = function (){
	var xTranslation = this.iXGridPos*MAP_TILE_WIDTH;
	var yTranslation = this.iYGridPos*0.75*MAP_TILE_HEIGHT;
	
	xTranslation = this.iXGridPos*MAP_TILE_WIDTH + (this.iYGridPos & 1)*0.5*MAP_TILE_WIDTH;
	
	gl.uniform2f(translationLocation, xTranslation, yTranslation);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVerticesBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.squareVerticesBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVerticesTestCoorBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.squareVerticesTestCoorBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
    gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, this.dynCursorText);
    gl.uniform2f(samplerUniform, MAP_TILE_WIDTH, MAP_TILE_HEIGHT);
    
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.squareVerticesBuffer.numItems);
	
}

DynCursor.prototype.handleLoadedTexture = function (texture) {

	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,	texture.image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.bindTexture(gl.TEXTURE_2D, null);

}

DynCursor.prototype.initTexture = function() {
	texture = gl.createTexture();
	texture.image = new Image();

	texture.image.onload = function() {
		DynCursor.prototype.handleLoadedTexture(texture);
	}
	
	texture.image.src = "images/dynCursor.png";
	this.dynCursorText = texture;
}

DynCursor.prototype.moveGroundCursor = function(){
	var SectX =  Math.trunc(mousePos.x / MAP_TILE_WIDTH);
	var SectY = Math.trunc(mousePos.y / (0.75 * MAP_TILE_HEIGHT));

	var SectPxlX = (mousePos.x % MAP_TILE_WIDTH);
	var SectPxlY = (mousePos.y % (0.75 * MAP_TILE_HEIGHT));

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