function GameGL() {
    this.character = new Character();
    this.character.initMesh();
    this.character.initTexture();
    this.character.initPosition(CHAR_INIT_POSX, CHAR_INIT_POSY);
    this.block = [];
    this.collisionY = 0;
}

GameGL.prototype.addBlock = function (){
    var block1 = new Block1();
    block1.initMesh();
    block1.initTexture();
    block1.initPosition(BLOCK1_INIT_POSX, BLOCK1_INIT_POSY);
    this.block.push(block1);
}

GameGL.prototype.collisionTest = function (){
    this.collisionY = -1;

    if (this.character.absYCurrentPos>CHAR_INIT_POSY) {
        this.collisionY = CHAR_INIT_POSY;
    }
    else {
        for (var i=0; i<this.block.length; i++) {
            if (this.character.absXCurrentPos>=(this.block[i].absXCurrentPos-BLOCK1_WIDTH/2)
                  && this.character.absXCurrentPos<=(this.block[i].absXCurrentPos+BLOCK1_WIDTH/2)) {
                if (this.character.absYCurrentPos<=(this.block[i].absYCurrentPos+BLOCK1_HEIGHT/2+CHARACTER_HEIGHT/2)
                      && this.character.absYCurrentPos>=(this.block[i].absYCurrentPos-BLOCK1_HEIGHT/2-CHARACTER_HEIGHT/2)) {
                    this.collisionY = this.block[i].absYCurrentPos;
                    break;
                }
            }
        }
    }
}

GameGL.prototype.run = function (){
    this.collisionTest();
    this.update();
    this.draw();

    if (this.block.length==0) {
        this.addBlock();
    }
}

GameGL.prototype.update = function (){
    this.character.updatePosition(this.collisionY);
    this.character.updateTexture();

    for (var i=0; i<this.block.length; i++) {
        this.block[i].updatePosition(this.character.charVect);
    }
}

GameGL.prototype.draw = function (){
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this.character.draw();
    
    for (var i=0; i<this.block.length; i++) {
        this.block[i].draw();
    }
}
