function GameGL() {
    this.ground = [];
    this.character = new Character();
    this.character.initMesh();
    this.character.initTexture();
    this.character.initPosition(CHAR_INIT_POSX, CHAR_INIT_POSY);
    this.groundSandXPos = 0;
    this.groundSandYPos = GROUND_INIT_POSY;
    this.lastGroundSandXPos = 0;
    this.isGoingUp = false;
    this.isGoingDown = false;
    this.isGoingStraight = false;
    this.countUpOrDown = 0;
}

GameGL.prototype.addGroundSand = function (){
    var i = 0;

    while (i<GROUNDSAND_PER_DRAW) {
        var groundSand = new Ground();
        groundSand.initMesh();
        this.groundSandXPos += 2;
        
        var rand = Math.round(2*Math.random() - 1);

        if (!this.isGoingUp && !this.isGoingDown && !this.isGoingStraight && rand<0) {
            this.isGoingUp = true;
        }
        else if (!this.isGoingUp && !this.isGoingDown && !this.isGoingStraight && rand>0) {
            this.isGoingDown = true;
        }
        else if (!this.isGoingUp && !this.isGoingDown && !this.isGoingStraight && rand==0) {
            this.isGoingStraight = true;
        }

        if (this.isGoingUp && this.countUpOrDown<20) {
            this.groundSandYPos -= 1;
            this.countUpOrDown++;
        }
        else if (this.isGoingDown && this.countUpOrDown<20) {
            this.groundSandYPos += 1;
            this.countUpOrDown++;
        }
        else if (this.isGoingStraight && this.countUpOrDown<20) {
            this.countUpOrDown++;
        }
        else if (this.countUpOrDown>=20) {
            this.groundSandXPos -= 2;
            this.isGoingUp = false;
            this.isGoingDown = false;
            this.isGoingStraight = false;
            this.countUpOrDown=0;
        }

        groundSand.initPosition(this.groundSandXPos, this.groundSandYPos);
        this.lastGroundSandXPos = groundSand.absXCurrentPos;
        this.ground.push(groundSand);
        i++;
    }
}

GameGL.prototype.collisionTest = function (){
    this.collisionY = -1;

    if (this.character.absYCurrentPos>=(GROUND_INIT_POSY-CHARACTER_HEIGHT)) {
        this.collisionY = GROUND_INIT_POSY;
    }
}

GameGL.prototype.run = function (){

    if (this.lastGroundSandXPos<=0.8*canvas.width) {
        this.addGroundSand();
    }

    this.update();
    this.collisionTest();
    this.afterCollisionFix();
    this.draw();
}

GameGL.prototype.update = function (){
    this.character.updatePosition(this.collisionY);
    this.character.updateTexture();
}

GameGL.prototype.afterCollisionFix = function (){
    this.character.afterCollisionFix(this.collisionY);
}

GameGL.prototype.draw = function (){
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    for (var i=0; i<this.ground.length; i++) {
        this.ground[i].draw();
    }
    this.character.draw();
}
