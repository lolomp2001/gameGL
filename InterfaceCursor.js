function InterfaceCursor() {
	this.squareVerticesBuffer;
	this.squareVerticesTextCoorBuffer;
	this.squareVerticesIndexBuffer;
	this.interfaceCursorText;
}

InterfaceCursor.prototype.initMesh = function (){
	this.squareVerticesBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVerticesBuffer);

	var vertices = [ 0, 0, 0, MAP_TILE_HEIGHT, MAP_TILE_WIDTH, MAP_TILE_HEIGHT, MAP_TILE_WIDTH, 0 ];
    
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

InterfaceCursor.prototype.draw = function (){
	var yTranslation = mousePos.y;
	var xTranslation = mousePos.x;
	
	gl.uniform2f(translationLocation, xTranslation, yTranslation);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVerticesBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.squareVerticesBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVerticesTextCoorBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.squareVerticesTextCoorBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
    gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, this.interfaceCursorText);
	gl.uniform1i(samplerUniform, 0);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.squareVerticesIndexBuffer);
    
    gl.drawElements(gl.TRIANGLES, this.squareVerticesIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

InterfaceCursor.prototype.handleLoadedTexture = function (texture) {

	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,	texture.image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.bindTexture(gl.TEXTURE_2D, null);

}

InterfaceCursor.prototype.initTexture = function() {
	this.interfaceCursorText = this.loadTexture("images/interfaceCursor.png");
}

InterfaceCursor.prototype.loadTexture = function(imagePath) {
	var texture = gl.createTexture();
	texture.image = new Image();

	texture.image.onload = function() {
		Character.prototype.handleLoadedTexture(texture);
	}
	
	texture.image.src = imagePath;
	return texture;
}
