function Character() {
	this.ANIMATION_RATE = 1/8;
	this.squareVerticesBuffer;
	this.squareVerticesTextCoorBuffer;
	this.CurrentCharacterText;
	this.CharacterText_E;
	this.CharacterText_W;
	this.squareVerticesIndexBuffer;
	this.iXCurrentPos = canvas.width;
	this.iYCurrentPos = canvas.height;
	this.absXCurrentPos;
	this.absYCurrentPos;
    this.absYInitPos;
    this.absTimeInit = drawCount;
	this.iXNextPos = this.iXCurrentPos;
	this.iYNextPos = this.iYCurrentPos;
	this.xTrans = 3;
	this.yTrans = 1;
	this.charVect = [ 0, 0 ];
	this.charText = 0;
    this.iSpriteFrameNumber = 0;
    this.isJumping = false;
    this.isFalling = false;
    this.speedX = 1;
}

Character.prototype.initMesh = function (){
	this.squareVerticesBuffer = gl.createBuffer();
	var vertices = [ -CHARACTER_WIDTH / 2, -CHARACTER_HEIGHT / 2,
	                 -CHARACTER_WIDTH / 2, CHARACTER_HEIGHT / 2, 
	                 CHARACTER_WIDTH / 2, CHARACTER_HEIGHT / 2, 
	                 CHARACTER_WIDTH / 2, -CHARACTER_HEIGHT / 2 ];
	this.squareVerticesBuffer.itemSize = 2;
	this.squareVerticesBuffer.numItems = 4;

	this.squareVerticesTextCoorBuffer = gl.createBuffer();
	var textCoord = [ 0.0, 1.0, 
                      0.0, 0.0,
                      1/4, 0.0,
                      1/4, 1.0 ];
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

Character.prototype.jump = function (){

    var delta = -40*this.yTrans + 4*this.yTrans*(drawCount-this.absTimeInit)^2;

    if (delta<=0 && this.absYCurrentPos > (this.absYInitPos - 150)) {
        this.charVect[1] = -1;
        this.absYCurrentPos += delta;
    }
    else {
        this.charVect[1] = 0;
        this.isJumping = false;
        this.absTimeInit = drawCount;
    }
}

Character.prototype.fall = function (collisionY){

    var delta = 4*this.yTrans*(drawCount-this.absTimeInit)^2;

    if (delta>0 && collisionY==-1) {
        this.charVect[1] = 1;
        this.isFalling = true;
        this.absYCurrentPos += delta;
    }
    else {
        this.charVect[1] = 0;
        this.isFalling = false;
        this.absTimeInit = drawCount;
    }
}

Character.prototype.updatePosition = function (collisionRight, collisionLeft, collisionX, collisionY){
    this.charVect = [0, 0];

	if (!this.isFalling && !this.isJumping && keyPressed.indexOf(32) != -1) {
        this.absYInitPos = this.absYCurrentPos;
        this.absTimeInit = drawCount;
		this.isJumping = true;
	}

    if (this.isJumping) {
        this.jump();
    }

    if (!this.isJumping) {
        this.fall(collisionY);
    }
	if (keyPressed.indexOf(37) != -1) {
        if (this.absXCurrentPos>=0.1*canvas.width && !collisionLeft) {
		    this.absXCurrentPos -= this.speedX*this.xTrans;
        }

        this.charText -= this.xTrans;
		this.charVect[0] = -1;
	}

	if (keyPressed.indexOf(39) != -1) {
        if (this.absXCurrentPos<=0.9*canvas.width && !collisionRight) {
		    this.absXCurrentPos += this.speedX*this.xTrans;    
        }

        this.charText += this.xTrans;
		this.charVect[0] = 1;
	}

    if (keyPressed.indexOf(16) != -1) {
        this.speedX = 1;
    }
    else {
        this.speedX = 1;
    }
}

Character.prototype.afterCollisionFix = function (collisionRight, collisionLeft, collisionX, collisionY){
    if (collisionY!=-1) {
        this.absYCurrentPos = collisionY;
    }

    if (collisionX!=-1) {
        if (collisionRight) {
            this.absXCurrentPos = collisionX - CHARACTER_WIDTH/2;
        }
        else if (collisionLeft) {
            this.absXCurrentPos = collisionX + CHARACTER_WIDTH/2;
        }
    }
}

Character.prototype.updateTexture = function (){

	//cas 1 (1,0)
	if (this.charVect[0] == 1) {
		this.CurrentCharacterText = this.CharacterText_E;
		var temp = Math.trunc(this.charText*this.ANIMATION_RATE);
        this.iSpriteFrameNumber = temp%CHARACTER_FRAMES_BY_SPRITE;
	}
	//cas 2 (-1,0)
	else if (this.charVect[0] == -1) {
		this.CurrentCharacterText = this.CharacterText_W;
		var temp = Math.trunc(this.charText*this.ANIMATION_RATE);
        this.iSpriteFrameNumber = temp%CHARACTER_FRAMES_BY_SPRITE;
	}

	var iImageRow = Math.trunc(this.iSpriteFrameNumber/CHARACTER_SPRITE_COLS);
	var iImageCol = this.iSpriteFrameNumber%CHARACTER_SPRITE_COLS;

	var textCoord = [ 0.0 + iImageCol / 4, 1.0 - iImageRow,
	                  0.0 + iImageCol / 4, 0.0 - iImageRow,
	                  1 / 4 + iImageCol / 4, 0.0 - iImageRow,
	                  1 / 4 + iImageCol / 4, 1.0 - iImageRow ];

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

    gl.disableVertexAttribArray(shaderProgram.vertexColorAttribute);
    gl.vertexAttrib4f(shaderProgram.vertexColorAttribute, 1, 1, 1, 1);
	gl.drawElements(gl.TRIANGLES, this.squareVerticesIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
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
	this.CharacterText_E = this.loadTexture("images/character_E.png");
	this.CurrentCharacterText = this.CharacterText_E;
	this.CharacterText_W = this.loadTexture("images/character_W.png");
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
