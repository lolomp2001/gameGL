function Scenery() {
	this.squareVerticesBuffer;
	this.squareVerticesTextCoorBuffer;
	this.sceneryText;
	this.squareVerticesIndexBuffer;
	this.initXPos;
	this.initYPos;
}

Scenery.prototype.initMesh = function (){
	this.initXPos = canvas.width;
	this.initYPos = canvas.height;
	
	this.squareVerticesBuffer = gl.createBuffer();
	

	var vertices = [ -SCENERY_TEXTURE_WIDTH / 2, -SCENERY_TEXTURE_HEIGHT / 2,
	     			-SCENERY_TEXTURE_WIDTH / 2, SCENERY_TEXTURE_HEIGHT / 2, 
	     			SCENERY_TEXTURE_WIDTH / 2,	SCENERY_TEXTURE_HEIGHT / 2, 
	     			SCENERY_TEXTURE_WIDTH / 2, -SCENERY_TEXTURE_HEIGHT / 2 ];
	
	this.squareVerticesBuffer.itemSize = 2;
	this.squareVerticesBuffer.numItems = 4;
	
	this.squareVerticesTextCoorBuffer = gl.createBuffer();
	var textCoord = [ 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0 ];
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

Scenery.prototype.draw = function (){

	gl.uniform2f(translationLocation, this.initXPos/2, this.initYPos/2);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVerticesBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.squareVerticesBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVerticesTextCoorBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.squareVerticesTextCoorBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
    gl.activeTexture(gl.TEXTURE0);
    
	gl.bindTexture(gl.TEXTURE_2D, this.sceneryText);
	gl.uniform1i(samplerUniform, 0);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.squareVerticesIndexBuffer);
    
    gl.drawElements(gl.TRIANGLES, this.squareVerticesIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

}

Scenery.prototype.handleLoadedTexture = function (texture) {

	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,	texture.image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.bindTexture(gl.TEXTURE_2D, null);

}

Scenery.prototype.initTexture = function() {
	var texture = gl.createTexture();
	texture.image = new Image();

	texture.image.onload = function() {
		Scenery.prototype.handleLoadedTexture(texture);
	}
	
	texture.image.src = "images/scenery.png";
	this.sceneryText = texture;
}