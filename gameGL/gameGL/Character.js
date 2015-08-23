function Character() {
	this.SIDE_SPEED = 3/GAME_FPS;
	this.DIAG_SPEED;
	this.squareVerticesBuffer;
	this.squareVerticesTextCoorBuffer;
	this.CharacterText;
	this.squareVerticesIndexBuffer;
	this.iXCurrentPos = Math.trunc(0.3*canvas.width / MAP_TILE_WIDTH);
	this.iYCurrentPos = Math.trunc(0.3*canvas.height / (0.75 * MAP_TILE_HEIGHT));
	this.absXCurrentPos;
	this.absYCurrentPos
	this.iXNextPos;
	this.iYNextPos;
	this.xTrans = 0;
	this.yTrans = 0;
	this.pathArray = [];
	this.iNextStep = 0;
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

Character.prototype.initPosition = function () {
	this.absXCurrentPos = (this.iXCurrentPos + this.xTrans)*MAP_TILE_WIDTH + ((this.iYCurrentPos) & 1)*0.5*MAP_TILE_WIDTH;
	this.absXCurrentPos = (this.iYCurrentPos + this.yTrans)*0.75*MAP_TILE_HEIGHT;
	this.setCharacterPosition(this.iXCurrentPos, this.iYCurrentPos);
}

Character.prototype.updatePosition = function (){
	this.absXCurrentPos = (this.iXCurrentPos + this.xTrans)*MAP_TILE_WIDTH + ((this.iYCurrentPos) & 1)*0.5*MAP_TILE_WIDTH;
	this.absYCurrentPos = (this.iYCurrentPos + this.yTrans)*0.75*MAP_TILE_HEIGHT;
	
	this.iXNextPos = this.pathArray[this.iNextStep].x;
	this.iYNextPos = this.pathArray[this.iNextStep].y;
	
	var absXNextPos = (this.iXNextPos)*MAP_TILE_WIDTH + ((this.iYNextPos) & 1)*0.5*MAP_TILE_WIDTH;
	var absYNextPos = (this.iYNextPos)*0.75*MAP_TILE_HEIGHT;
	
	if (this.absXCurrentPos==absXNextPos && this.absYCurrentPos==absYNextPos) {
		this.iXCurrentPos = this.iXNextPos;
		this.iYCurrentPos = this.iYNextPos;
		this.xTrans = 0;
		this.yTrans = 0;
		
		if (this.iNextStep<this.pathArray.length-1) {
			this.iNextStep++;
		}
	}
	
	var vectA = Math.sign(absXNextPos-this.absXCurrentPos);
	var vectB = Math.sign(absYNextPos-this.absYCurrentPos);
	
	//cas 1 (-1,-1)
	if (vectA<0 && vectB<0) {
		console.log("cas 1");
		this.xTrans -= 0.1;
		this.yTrans -= 0.1*MAP_TILE_FACTOR;
	}
	//cas 2 (1,-1)
	else if (vectA>0 && vectB<0) {
		console.log("cas 2");
		this.xTrans += 0.1;
		this.yTrans -= 0.1*MAP_TILE_FACTOR;
	}
	//cas 1 (1,0)
	else if (vectA>0 && vectB==0) {
		console.log("cas 3");
		this.xTrans += 0.1;
	}
	//cas 1 (1,1)
	else if (vectA>0 && vectB>0) {
		console.log("cas 4");
		this.xTrans += 0.1;
		this.yTrans += 0.1*MAP_TILE_FACTOR;
	}
	//cas 1 (-1,1)
	else if (vectA<0 && vectB>0) {
		console.log("cas 5");
		this.xTrans -= 0.1;
		this.yTrans += 0.1*MAP_TILE_FACTOR;
	}
	//cas 1 (-1,0)
	else if (vectA<0 && vectB==0) {
		console.log("cas 6");
		this.xTrans -= 0.1;
	}
	
	console.log(vectA, vectB);
}

Character.prototype.draw = function (){
		gl.uniform2f(translationLocation, this.absXCurrentPos, this.absYCurrentPos-2*0.75*MAP_TILE_HEIGHT);
	
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
	var iXMax = Math.round(canvas.width / MAP_TILE_WIDTH);
	var iYMax = Math.round(canvas.height / (0.75 * MAP_TILE_HEIGHT));
	
	var dijkstra = new Dijkstra();
	dijkstra.initializeGraph(0, 0, iXMax, iYMax);
	dijkstra.initializeFirstItem(this.iXCurrentPos, this.iYCurrentPos);
	this.pathArray = dijkstra.getPath(0, 0, iXMax, iYMax, this.iXCurrentPos, this.iYCurrentPos, iXDestination, iYDestination);
	
	this.iNextStep = 0;
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