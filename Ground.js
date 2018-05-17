function Ground() {
	this.squareVerticesBuffer;
	this.squareVerticesTextCoorBuffer;
    this.squareVerticesColorBuffer;
	this.squareVerticesIndexBuffer;
	this.absXCurrentPos;
	this.absYCurrentPos;
    this.absYInitPos;
    this.absTimeInit;
    this.whiteTex;
    this.textCoord;
}

Ground.prototype.initMesh = function (){
	this.squareVerticesBuffer = gl.createBuffer();

	var vertices = [ -GROUND_WIDTH / 2, -GROUND_HEIGHT / 2,
	                 -GROUND_WIDTH / 2, GROUND_HEIGHT / 2, 
	                 GROUND_WIDTH / 2, GROUND_HEIGHT / 2, 
	                 GROUND_WIDTH / 2, -GROUND_HEIGHT / 2 ];

	this.squareVerticesBuffer.itemSize = 2;
	this.squareVerticesBuffer.numItems = 4;

    this.squareVerticesColorBuffer = gl.createBuffer();
    var colors = [
        0.0, 0.0, 0.0, 1.0,
        0.0, 0.0, 0.0, 1.0,
        0.0, 0.0, 0.0, 1.0,
        0.0, 0.0, 0.0, 1.0
    ];
    this.squareVerticesColorBuffer.itemSize = 4;
    this.squareVerticesColorBuffer.numItems = 4;

	this.squareVerticesIndexBuffer = gl.createBuffer();
	var indices = [ 0, 1, 2, 0, 2, 3 ];
	this.squareVerticesIndexBuffer.numItems = 6;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVerticesBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVerticesColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.squareVerticesIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    this.whiteTex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.whiteTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]));
    gl.bindTexture(gl.TEXTURE_2D, null);
}

Ground.prototype.initPosition = function (xInitPos, yInitPos) {
	this.absXCurrentPos = xInitPos;
	this.absYCurrentPos = yInitPos;
}

Ground.prototype.updatePosition = function (collisionY){

}

Ground.prototype.draw = function (){
    gl.uniform2f(translationLocation, this.absXCurrentPos, this.absYCurrentPos);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVerticesBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.squareVerticesBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, this.whiteTex);
    gl.uniform1i(samplerUniform, 0);
    gl.disableVertexAttribArray(shaderProgram.textureCoordAttribute);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVerticesColorBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, this.squareVerticesColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.squareVerticesIndexBuffer);

	gl.drawElements(gl.TRIANGLES, this.squareVerticesIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
}
