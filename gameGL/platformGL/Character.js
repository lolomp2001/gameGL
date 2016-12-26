function Character() {
	this.ANIMATION_RATE = 1/16;
	this.squareVerticesBuffer;
	this.squareVerticesTextCoorBuffer;
	this.CurrentCharacterText;
	this.CharacterText_E;
	this.CharacterText_S;
	this.CharacterText_W;
	this.CharacterText_N;
	this.squareVerticesIndexBuffer;
	this.iXCurrentPos = canvas.width;
	this.iYCurrentPos = canvas.height;
	this.absXCurrentPos;
	this.absYCurrentPos
	this.iXNextPos = this.iXCurrentPos;
	this.iYNextPos = this.iYCurrentPos;
	this.xTrans = 3;
	this.yTrans = 0;
	this.charVect = [ 0, 0 ];
	this.charText = 0;
}

Character.prototype.initMesh = function (){
	this.squareVerticesBuffer = gl.createBuffer();

	var vertices = [ -BACKGROUND_CHARACTER_WIDTH / 2, -BACKGROUND_CHARACTER_HEIGHT / 2,
	                 -BACKGROUND_CHARACTER_WIDTH / 2, BACKGROUND_CHARACTER_HEIGHT / 2, 
	                 BACKGROUND_CHARACTER_WIDTH / 2,	BACKGROUND_CHARACTER_HEIGHT / 2, 
	                 BACKGROUND_CHARACTER_WIDTH / 2, -BACKGROUND_CHARACTER_HEIGHT / 2 ];

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
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

}

Character.prototype.initPosition = function (xInitPos, yInitPos) {
	this.absXCurrentPos = xInitPos;
	this.absYCurrentPos = yInitPos;
}

Character.prototype.updatePosition = function (){
	if (keyPressed.indexOf(39) != -1) {
		this.absXCurrentPos += this.xTrans;
		this.charText += this.xTrans;
		this.charVect = [ 1, 0 ];
	}
	
	else {
		this.charVect = [ 0, 0 ];
	}
}

Character.prototype.updateTexture = function (){
	var iSpriteFrameNumber = 0;

	//cas 1 (0,-1)
	if (this.charVect[0] == 0 && this.charVect[1] == 1) {
//		this.CurrentCharacterText = this.CharacterText_N;
//		var dist = Math.pow(Math.pow(this.xTrans, 2)+Math.pow(this.yTrans, 2),0.5);
//		iFrameNumber = Math.trunc(dist/this.ANIMATION_RATE);
	}
	//cas 2 (1,0)
	else if (this.charVect[0] == 1 && this.charVect[1] == 0) {
		this.CurrentCharacterText = this.CharacterText_E;
		var temp = Math.trunc(this.charText * this.ANIMATION_RATE);
		iSpriteFrameNumber = temp%4;
		console.log(iSpriteFrameNumber);
	}
	//cas 3 (0,1)
	else if (this.charVect == [ 0, -1 ]) {
//		this.CurrentCharacterText = this.CharacterText_S;
//		var dist = Math.pow(Math.pow(this.xTrans, 2)+Math.pow(this.yTrans, 2),0.5);
//		iFrameNumber = Math.trunc(dist/this.ANIMATION_RATE);
	}
	//cas 4 (-1,0)
	else if (this.charVect == [ -1, 0 ]) {
		this.CurrentCharacterText = this.CharacterText_W;
		iSpriteFrameNumber = Math.trunc(this.xTrans/this.ANIMATION_RATE);
	}

	var iImageRow = Math.trunc(iSpriteFrameNumber/2);
	var iImageCol = iSpriteFrameNumber%2;

	var textCoord = [ 0.0 + iImageCol / 2, 1.0 - iImageRow / 2,
	                  0.0 + iImageCol / 2, 1/2 - iImageRow / 2,
	                  1 / 2 + iImageCol / 2, 1/2 - iImageRow / 2,
	                  1 / 2 + iImageCol / 2, 1.0 - iImageRow / 2 ];

	gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVerticesTextCoorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textCoord), gl.STATIC_DRAW);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.squareVerticesIndexBuffer);
}

Character.prototype.draw = function (){
	gl.uniform2f(translationLocation, this.absXCurrentPos, this.absYCurrentPos);

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

Character.prototype.handleLoadedTexture = function (texture) {

	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,	texture.image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.bindTexture(gl.TEXTURE_2D, null);

}

Character.prototype.initTexture = function() {
	this.CharacterText_E = this.loadTexture("images/mario_e.png");
	this.CurrentCharacterText = this.CharacterText_E;

	//this.CharacterText_S = this.loadTexture("images/mario_s.png");
	this.CharacterText_W = this.loadTexture("images/mario_w.png");
	//this.CharacterText_N = this.loadTexture("images/mario_n.png");
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