function Character() {
	this.SIDE_SPEED = 1/GAME_FPS;
	this.DIAG_SPEED = Math.pow(2, 0.5);
	this.ANIMATION_RATE = 1/8;
	this.squareVerticesBuffer;
	this.squareVerticesTextCoorBuffer;
	this.CurrentCharacterText;
	this.CharacterText_E;
	this.CharacterText_SE;
	this.CharacterText_SW;
	this.CharacterText_W;
	this.CharacterText_NW;
	this.CharacterText_NE;
	this.squareVerticesIndexBuffer;
	this.iXCurrentPos = Math.trunc(0.3*canvas.width / MAP_TILE_WIDTH);
	this.iYCurrentPos = Math.trunc(0.3*canvas.height / (0.75 * MAP_TILE_HEIGHT));
	this.absXCurrentPos;
	this.absYCurrentPos
	this.iXNextPos = this.iXCurrentPos;
	this.iYNextPos = this.iYCurrentPos;
	this.dijkstra = new Dijkstra();
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

Character.prototype.initPosition = function (gridPosArray) {
	this.absXCurrentPos = (this.iXCurrentPos + this.xTrans)*MAP_TILE_WIDTH + ((this.iYCurrentPos) & 1)*0.5*MAP_TILE_WIDTH;
	this.absYCurrentPos = (this.iYCurrentPos + this.yTrans)*0.75*MAP_TILE_HEIGHT;
	this.setCharacterPosition(this.iXCurrentPos, this.iYCurrentPos, gridPosArray);
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
	
	if (vectB==0) {
		this.xTrans += this.SIDE_SPEED*vectA*this.DIAG_SPEED;
		if (Math.abs(this.xTrans)>=1) {
			this.xTrans = Math.sign(this.xTrans);
		}
	}
	
	else {
		this.xTrans += this.SIDE_SPEED*vectA;
		this.yTrans += this.SIDE_SPEED*MAP_TILE_FACTOR*vectB;
		if (Math.abs(this.xTrans)>=1) {
			this.xTrans = Math.sign(this.xTrans);
		}
		
		else if (Math.abs(this.yTrans)>=1) {
			this.yTrans = Math.sign(this.yTrans);
		}
	}
}

Character.prototype.updateTexture = function (){
	var iFrameNumber = 0;
	
	//cas 1 (-1,-1)
	if (this.xTrans<0 && this.yTrans<0) {
		this.CurrentCharacterText = this.CharacterText_NW;
		var dist = Math.pow(Math.pow(this.xTrans, 2)+Math.pow(this.yTrans, 2),0.5);
		iFrameNumber = Math.trunc(dist/this.ANIMATION_RATE);
		
	}
	//cas 2 (1,-1)
	else if (this.xTrans>0 && this.yTrans<0) {
		this.CurrentCharacterText = this.CharacterText_NE;
		var dist = Math.pow(Math.pow(this.xTrans, 2)+Math.pow(this.yTrans, 2),0.5);
		iFrameNumber = Math.trunc(dist/this.ANIMATION_RATE);
	}
	//cas 1 (1,0)
	else if (this.xTrans>0 && this.yTrans==0) {
		this.CurrentCharacterText = this.CharacterText_E;
		iFrameNumber = Math.trunc(this.xTrans/this.ANIMATION_RATE);
	}
	//cas 1 (1,1)
	else if (this.xTrans>0 && this.yTrans>0) {
		this.CurrentCharacterText = this.CharacterText_SE;
		var dist = Math.pow(Math.pow(this.xTrans, 2)+Math.pow(this.yTrans, 2),0.5);
		iFrameNumber = Math.trunc(dist/this.ANIMATION_RATE);
	}
	//cas 1 (-1,1)
	else if (this.xTrans<0 && this.yTrans>0) {
		this.CurrentCharacterText = this.CharacterText_SW;
		var dist = Math.pow(Math.pow(this.xTrans, 2)+Math.pow(this.yTrans, 2),0.5);
		iFrameNumber = Math.trunc(dist/this.ANIMATION_RATE);
	}
	//cas 1 (-1,0)
	else if (this.xTrans<0 && this.yTrans==0) {
		this.CurrentCharacterText = this.CharacterText_W;
		iFrameNumber = Math.trunc(this.xTrans/this.ANIMATION_RATE);
	}
	
	var iImageRow = Math.trunc(iFrameNumber/2);
	var iImageCol = iFrameNumber%2;
	
	var textCoord = [ 0.0 + iImageCol / 2, 1.0 - iImageRow / 4,
			0.0 + iImageCol / 2, 3 / 4 - iImageRow / 4,
			1 / 2 + iImageCol / 2, 3 / 4 - iImageRow / 4,
			1 / 2 + iImageCol / 2, 1.0 - iImageRow / 4 ];

	gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVerticesTextCoorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textCoord), gl.STATIC_DRAW);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.squareVerticesIndexBuffer);
}

Character.prototype.draw = function (){
		gl.uniform2f(translationLocation, this.absXCurrentPos, this.absYCurrentPos-2*0.75*MAP_TILE_HEIGHT);
	
		gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVerticesBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.squareVerticesBuffer.itemSize, gl.FLOAT, false, 0, 0);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVerticesTextCoorBuffer);
	    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.squareVerticesTextCoorBuffer.itemSize, gl.FLOAT, false, 0, 0);
		
	    gl.activeTexture(gl.TEXTURE0);
	    
		gl.bindTexture(gl.TEXTURE_2D, this.CurrentCharacterText);
	    gl.uniform1i(samplerUniform, 0);
	    
	    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.squareVerticesIndexBuffer);
	    
	    gl.drawElements(gl.TRIANGLES, this.squareVerticesIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

Character.prototype.setCharacterPosition = function (iXDestination, iYDestination, gridPosArray){
	var iXMax = Math.round(canvas.initialWidth / MAP_TILE_WIDTH);
	var iYMax = Math.round(canvas.initialWidth / (0.75 * MAP_TILE_HEIGHT));
	
	this.dijkstra.initializeGraph(0, 0, iXMax, iYMax, gridPosArray);
	this.dijkstra.initializeFirstItem(this.iXNextPos, this.iYNextPos);
	this.pathArray = this.dijkstra.getPath(0, 0, iXMax, iYMax, this.iXNextPos, this.iYNextPos, iXDestination, iYDestination);
	
	this.iNextStep = 0;
}

Character.prototype.handleLoadedTexture = function (texture) {

	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,	texture.image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.bindTexture(gl.TEXTURE_2D, null);

}

Character.prototype.initTexture = function() {
	this.CharacterText_E = this.loadTexture("images/character_e.png");
	this.CurrentCharacterText = this.CharacterText_E;
	
	this.CharacterText_SE = this.loadTexture("images/character_se.png");
	this.CharacterText_SW = this.loadTexture("images/character_sw.png");
	this.CharacterText_W = this.loadTexture("images/character_w.png");
	this.CharacterText_NW = this.loadTexture("images/character_nw.png");
	this.CharacterText_NE = this.loadTexture("images/character_ne.png");
}

Character.prototype.loadTexture = function(imagePath) {
	var texture = gl.createTexture();
	texture.image = new Image();

	texture.image.onload = function() {
		Character.prototype.handleLoadedTexture(texture);
	}
	
	texture.image.src = imagePath;
	return texture;
}