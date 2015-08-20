function Character() {
	this.squareVerticesBuffer;
	this.squareVerticesTextCoorBuffer;
	this.CharacterText;
	this.squareVerticesIndexBuffer;
	this.iXDestination = Math.trunc(0.3*canvas.width / MAP_TILE_WIDTH);;
	this.iYDestination = Math.trunc(0.3*canvas.height / (0.75 * MAP_TILE_HEIGHT));
}

Character.prototype.initMesh = function (){
	
	
	this.squareVerticesBuffer = gl.createBuffer();
	

	var vertices = [ -BACKGROUND_CHARACTER_WIDTH / 4, -BACKGROUND_CHARACTER_HEIGHT / 8,
	     			-BACKGROUND_CHARACTER_WIDTH / 4, BACKGROUND_CHARACTER_HEIGHT / 8, 
	     			BACKGROUND_CHARACTER_WIDTH / 4,	BACKGROUND_CHARACTER_HEIGHT / 8, 
	     			BACKGROUND_CHARACTER_WIDTH / 4, -BACKGROUND_CHARACTER_HEIGHT / 8 ];
	
	this.squareVerticesBuffer.itemSize = 2;
	this.squareVerticesBuffer.numItems = 4;
	
	this.squareVerticesTextCoorBuffer = gl.createBuffer();
	var textCoord = [ 0.0, 1.0, 0.0, 3/4, 1/2, 3/4, 1/2, 1.0 ];
	this.squareVerticesTextCoorBuffer.itemSize = 2;
	this.squareVerticesTextCoorBuffer.numItems = 4;
	
	this.squareVerticesIndexBuffer = gl.createBuffer();
	var indices = [ 0, 1, 2, 0, 2, 3 ];
	this.squareVerticesIndexBuffer.numItems = 6;
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVerticesBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVerticesTextCoorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textCoord), gl.STATIC_DRAW);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.squareVerticesIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices),
			gl.STATIC_DRAW);
	
}

Character.prototype.draw = function (){
	var yTranslation = this.iYDestination*0.75*MAP_TILE_HEIGHT;
	var xTranslation = this.iXDestination*MAP_TILE_WIDTH + (this.iYDestination & 1)*0.5*MAP_TILE_WIDTH;

	gl.uniform2f(translationLocation, xTranslation, yTranslation);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVerticesBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.squareVerticesBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVerticesTextCoorBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.squareVerticesTextCoorBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
    gl.activeTexture(gl.TEXTURE0);
    
	gl.bindTexture(gl.TEXTURE_2D, this.CharacterText);
    gl.uniform2f(samplerUniform, BACKGROUND_CHARACTER_WIDTH, BACKGROUND_CHARACTER_HEIGHT);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.squareVerticesIndexBuffer);
    
    gl.drawElements(gl.TRIANGLES, this.squareVerticesIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

}

Character.prototype.setCharacterPosition = function (iXDestination, iYDestination){
	this.iXDestination = iXDestination;
	this.iYDestination = iYDestination-2;
}

Character.prototype.handleLoadedTexture = function (texture) {

	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,	texture.image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.bindTexture(gl.TEXTURE_2D, null);

}

Character.prototype.initTexture = function() {
	var texture = gl.createTexture();
	texture.image = new Image();

	texture.image.onload = function() {
		Character.prototype.handleLoadedTexture(texture);
	}
	
	texture.image.src = "images/character_e.png";
	this.CharacterText = texture;
}