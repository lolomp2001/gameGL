function Ground() {
	this.squareVerticesBuffer;
	this.squareVerticesTextCoorBuffer;
	this.groundText;
	this.squareVerticesIndexBuffer;
}

Ground.prototype.initGroundMesh = function (){
	var xScale = BACKGROUND_TILE_WIDTH - BACKGROUND_X_OFFSET;
	var yScale = BACKGROUND_TILE_HEIGHT - BACKGROUND_Y_OFFSET;
	var xOffset = 0;
	var yOffset = 0;
	
	this.squareVerticesBuffer = gl.createBuffer();
	

	var vertices = [  -BACKGROUND_TEXTURE_WIDTH / 2, -BACKGROUND_TEXTURE_HEIGHT / 2,
	                  -BACKGROUND_TEXTURE_WIDTH / 2, BACKGROUND_TEXTURE_HEIGHT / 2, 
	                  BACKGROUND_TEXTURE_WIDTH / 2,	BACKGROUND_TEXTURE_HEIGHT / 2, 
	    			BACKGROUND_TEXTURE_WIDTH / 2, -BACKGROUND_TEXTURE_HEIGHT / 2 ];
	
	this.squareVerticesBuffer.itemSize = 2;
	this.squareVerticesBuffer.numItems = 4;
	
	this.squareVerticesTextCoorBuffer = gl.createBuffer();
	var textCoord = [ 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0 ];
	this.squareVerticesTextCoorBuffer.itemSize = 2;
	this.squareVerticesTextCoorBuffer.numItems = 4;
	
	this.squareVerticesIndexBuffer = gl.createBuffer();
	var indices = [ 0, 1, 2, 0, 2, 3 ];
	this.squareVerticesIndexBuffer.numItems = 6;
	
	var xIteration = Math.round(gl.viewportWidth/xScale);
	var yIteration = Math.round(gl.viewportHeight/yScale);
	var k = 0;
	for (var i=0; i<=xIteration; i++) {

		xOffset += 18;
		yOffset += 12;
		
		for (var j=0; j<=yIteration; j++) {

			vertices.push( -BACKGROUND_TEXTURE_WIDTH / 2 + xScale*i - xOffset, -BACKGROUND_TEXTURE_HEIGHT / 2 + yScale*j - yOffset,
		            -BACKGROUND_TEXTURE_WIDTH / 2 + xScale*i - xOffset, BACKGROUND_TEXTURE_HEIGHT / 2 + yScale*j - yOffset, 
		            BACKGROUND_TEXTURE_WIDTH / 2 + xScale*i - xOffset,	BACKGROUND_TEXTURE_HEIGHT / 2 + yScale*j - yOffset, 
					BACKGROUND_TEXTURE_WIDTH / 2 + xScale*i - xOffset, -BACKGROUND_TEXTURE_HEIGHT / 2 + yScale*j - yOffset );
			
			this.squareVerticesBuffer.numItems += 4;
		
			textCoord.push( 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0 );
			this.squareVerticesTextCoorBuffer.numItems += 4;
			
			indices.push(4*k, 4*k+1, 4*k+2, 4*k, 4*k+2, 4*k+3);
			this.squareVerticesIndexBuffer.numItems += 6;
			k++;
		}
	}
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVerticesBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVerticesTextCoorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textCoord), gl.STATIC_DRAW);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.squareVerticesIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices),
			gl.STATIC_DRAW);
	
}

Ground.prototype.draw = function (){

	gl.uniform2f(translationLocation, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVerticesBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.squareVerticesBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVerticesTextCoorBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.squareVerticesTextCoorBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
    gl.activeTexture(gl.TEXTURE0);
    
	gl.bindTexture(gl.TEXTURE_2D, this.groundText);
    gl.uniform2f(samplerUniform, BACKGROUND_TILE_WIDTH, BACKGROUND_TILE_HEIGHT);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.squareVerticesIndexBuffer);
    
    gl.drawElements(gl.TRIANGLES, this.squareVerticesIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

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