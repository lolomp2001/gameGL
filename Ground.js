function Ground() {
    this.squareVerticesBuffer;
    this.squareVerticesTextCoorBuffer;
    this.groundText;
    this.squareVerticesIndexBuffer;
    this.initXPos;
    this.initYPos;
}

Ground.prototype.initMesh = function (){    
    this.squareVerticesBuffer = gl.createBuffer();

    var vertices = [ -GROUND_WIDTH / 2, -GROUND_HEIGHT / 2,
                     -GROUND_WIDTH / 2, GROUND_HEIGHT / 2, 
                     GROUND_WIDTH / 2, GROUND_HEIGHT / 2, 
                     GROUND_WIDTH / 2, -GROUND_HEIGHT / 2 ];
    
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
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
}

Ground.prototype.draw = function (){
    gl.uniform2f(translationLocation, GROUND_INIT_POSX, GROUND_INIT_POSY);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVerticesBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.squareVerticesBuffer.itemSize, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVerticesTextCoorBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.squareVerticesTextCoorBuffer.itemSize, gl.FLOAT, false, 0, 0);
    
    gl.activeTexture(gl.TEXTURE0);
    
    gl.bindTexture(gl.TEXTURE_2D, this.groundText);
    gl.uniform1i(samplerUniform, 0);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.squareVerticesIndexBuffer);
    
    gl.drawElements(gl.TRIANGLES, this.squareVerticesIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

Ground.prototype.handleLoadedTexture = function (texture) {

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,    texture.image);
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