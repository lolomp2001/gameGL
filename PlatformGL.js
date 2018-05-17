function GameGL() {
    this.ground = new Ground();
    this.ground.initMesh();
    this.ground.initTexture();

    this.character = new Character();
    this.character.initMesh();
    this.character.initTexture();
    this.character.initPosition(CHAR_INIT_POSX, CHAR_INIT_POSY);
    
    this.nextBlockX = 0;
    this.nextBlockY = BLOCK1_INIT_POSY;
    this.block = [];
    this.collisionY = 0;
}

GameGL.prototype.addBlock = function (){
    var block1 = new Block1();
    block1.initMesh();
    block1.initTexture();
    block1.initPosition(this.nextBlockX, this.nextBlockY);
    this.block.push(block1);
}

GameGL.prototype.collisionTest = function (){
    this.collisionY = -1;

    if (this.character.absYCurrentPos>=CHAR_INIT_POSY - 0.3*CHARACTER_HEIGHT) {
        this.collisionY = CHAR_INIT_POSY - 0.3*CHARACTER_HEIGHT;
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
    this.update();
    this.collisionTest();
    this.afterCollisionFix();
    this.draw();

    if (this.block.length<=MAX_BLOCK) {
        if (this.block.length>0) {
            this.nextBlockX = this.block[this.block.length-1].absXCurrentPos + 150;
        }
        else {
            this.nextBlockX += 150;
        }

        this.nextBlockY -= (Math.sign(0.5-Math.random())) * (18 + 100*Math.random());

        if (this.nextBlockY >= BLOCK1_INIT_POSY) {
            this.nextBlockY = BLOCK1_INIT_POSY - 18 - 100*Math.random();
        }

        this.addBlock(this.nextBlockX, this.nextBlockY);   
    }

    for (var i=0; i<this.block.length; i++) {
        if (this.block[i].absXCurrentPos<=-BLOCK1_WIDTH/2) {
            var index = this.block.indexOf(this.block[i]);
            this.block.splice(index, 1);
        }
    }
}

GameGL.prototype.update = function (){
    this.character.updatePosition(this.collisionY);
    this.character.updateTexture();

    if (this.character.absXCurrentPos<=0.1*canvas.width && this.character.charVect[0]==-1) {
        for (var i=0; i<this.block.length; i++) {
            this.block[i].updatePosition(this.character.charVect);
        }
    }
    else if (this.character.absXCurrentPos>=0.9*canvas.width && this.character.charVect[0]==1) {
        for (var i=0; i<this.block.length; i++) {
            this.block[i].updatePosition(this.character.charVect);
        }
    }
}

GameGL.prototype.afterCollisionFix = function (){
    this.character.afterCollisionFix(this.collisionY);
}

GameGL.prototype.draw = function (){
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this.ground.draw();
    this.character.draw();
    
    for (var i=0; i<this.block.length; i++) {
        this.block[i].draw();
    }
}
