function Ground() {
	this.squareVerticesBuffer;
	this.squareVerticesTextCoorBuffer;
	this.groundText;
	this.squareVerticesIndexBuffer;
}

Ground.prototype.initGroundMesh = function (){
	this.squareVerticesBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVerticesBuffer);

	var vertices = [  -BACKGROUND_TEXTURE_WIDTH / 2, -BACKGROUND_TEXTURE_HEIGHT / 2,
	                  -BACKGROUND_TEXTURE_WIDTH / 2, BACKGROUND_TEXTURE_HEIGHT / 2, 
	                  BACKGROUND_TEXTURE_WIDTH / 2,	BACKGROUND_TEXTURE_HEIGHT / 2, 
	    			BACKGROUND_TEXTURE_WIDTH / 2, -BACKGROUND_TEXTURE_HEIGHT / 2 ];
	
	vertices.push( -BACKGROUND_TEXTURE_WIDTH / 2 + 200, -BACKGROUND_TEXTURE_HEIGHT / 2,
            -BACKGROUND_TEXTURE_WIDTH / 2 + 200, BACKGROUND_TEXTURE_HEIGHT / 2, 
            BACKGROUND_TEXTURE_WIDTH / 2 + 200,	BACKGROUND_TEXTURE_HEIGHT / 2, 
			BACKGROUND_TEXTURE_WIDTH / 2 + 200, -BACKGROUND_TEXTURE_HEIGHT / 2 );
	

	
	
    
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

	this.squareVerticesBuffer.itemSize = 2;
	this.squareVerticesBuffer.numItems = 8;
	
	this.squareVerticesTextCoorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVerticesTextCoorBuffer);
	
	var textCoord = [ 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0 ];
	
	textCoord.push( 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0 );
	
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textCoord), gl.STATIC_DRAW);
	
	this.squareVerticesTextCoorBuffer.itemSize = 2;
	this.squareVerticesTextCoorBuffer.numItems = 8;
	
	this.squareVerticesIndexBuffer = gl.createBuffer();

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.squareVerticesIndexBuffer);
	  
	var indices = [ 0, 1, 2, 0, 2, 3, 
	                4, 5, 6, 4, 6, 7 ];

	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices),
			gl.STATIC_DRAW);
	
}

Ground.prototype.draw = function (){

	gl.uniform2f(translationLocation, 100, 100);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVerticesBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.squareVerticesBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVerticesTextCoorBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.squareVerticesTextCoorBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
    gl.activeTexture(gl.TEXTURE0);
    
	gl.bindTexture(gl.TEXTURE_2D, this.groundText);
    gl.uniform2f(samplerUniform, BACKGROUND_TILE_WIDTH, BACKGROUND_TILE_HEIGHT);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.squareVerticesIndexBuffer);
    
    gl.drawElements(gl.TRIANGLES, 12, gl.UNSIGNED_SHORT, 0);
	
}

Ground.prototype.handleLoadedTexture = function (texture) {

	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,	texture.image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.bindTexture(gl.TEXTURE_2D, null);

}

Ground.prototype.initTexture = function() {
	var texture = gl.createTexture();
	texture.image = new Image();

	texture.image.onload = function() {
		Ground.prototype.handleLoadedTexture(texture);
	}
	
	texture.image.src = "images/ground.png";
	this.groundText = texture;
}