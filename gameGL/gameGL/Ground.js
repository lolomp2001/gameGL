function Ground() {
	this.squareVerticesBuffer;
	this.squareVerticesTextCoorBuffer;
	this.groundText;
}

Ground.prototype.initGroundMesh = function (){
	this.squareVerticesBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVerticesBuffer);

	var vertices = [  -BACKGROUND_TEXTURE_WIDTH / 2, -BACKGROUND_TEXTURE_HEIGHT / 2, 0.0,
	                  BACKGROUND_TEXTURE_WIDTH / 2, -BACKGROUND_TEXTURE_HEIGHT / 2, 0.0, 
	                  BACKGROUND_TEXTURE_WIDTH / 2,	BACKGROUND_TEXTURE_HEIGHT / 2, 0.0, 
	    			-BACKGROUND_TEXTURE_WIDTH / 2, -BACKGROUND_TEXTURE_HEIGHT / 2, 0.0, 
	    			-BACKGROUND_TEXTURE_WIDTH / 2, BACKGROUND_TEXTURE_HEIGHT / 2, 0.0, 
	    			BACKGROUND_TEXTURE_WIDTH / 2, BACKGROUND_TEXTURE_HEIGHT / 2, 0.0 ];
	
	vertices.push( -BACKGROUND_TEXTURE_WIDTH / 2 + 100, -BACKGROUND_TEXTURE_HEIGHT / 2, 0.0,
            BACKGROUND_TEXTURE_WIDTH / 2 + 200, -BACKGROUND_TEXTURE_HEIGHT / 2, 0.0, 
            BACKGROUND_TEXTURE_WIDTH / 2 + 200,	BACKGROUND_TEXTURE_HEIGHT / 2, 0.0, 
			-BACKGROUND_TEXTURE_WIDTH / 2 + 200, -BACKGROUND_TEXTURE_HEIGHT / 2, 0.0, 
			-BACKGROUND_TEXTURE_WIDTH / 2 + 200, BACKGROUND_TEXTURE_HEIGHT / 2, 0.0, 
			BACKGROUND_TEXTURE_WIDTH / 2 + 200, BACKGROUND_TEXTURE_HEIGHT / 2, 0.0 );
    
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

	this.squareVerticesBuffer.itemSize = 3;
	this.squareVerticesBuffer.numItems = 12;
	
	this.squareVerticesTextCoorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVerticesTextCoorBuffer);
	
	var textCoord = [ 1.0, 0.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0 ];
	
	textCoord.push( 1.0, 0.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0 );
	
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textCoord), gl.STATIC_DRAW);
	
	this.squareVerticesTextCoorBuffer.itemSize = 2;
	this.squareVerticesTextCoorBuffer.numItems = 12;
	
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
    
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.squareVerticesBuffer.numItems);
	
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