function GameGL() {
    this.ground = [];
    this.character = new Character();
    this.character.initMesh();
    this.character.initTexture();
    this.character.initPosition(CHAR_INIT_POSX, CHAR_INIT_POSY);
    this.groundSandXPos = 0;
    this.groundSandYPos = GROUND_INIT_POSY;
    this.lastGroundSandXPos = 0;
    this.randStraightNumber = Math.round(Math.random() + 1);
    this.isGoingDown = false;
    this.isGoingUp = false;
    this.isGoingStraight = true;
    this.countHorizontalBlock = 0;
    this.countVertivalBlock = 0;
}

GameGL.prototype.addGroundSand = function (){
    var i = 0;

    while (i<GROUNDSAND_PER_DRAW) {
        var groundSand = new Ground();
        groundSand.initMesh();

        if (!this.isGoingDown && !this.isGoingUp && !this.isGoingStraight) {
            var rand = Math.round(2*Math.random() - 1);
            if (rand>0) {
                this.isGoingDown = true;
                this.isGoingUp = false;
                this.isGoingStraight = false;
            }
            else if (rand<0) {
                this.isGoingUp = true;
                this.isGoingDown = false;
                this.isGoingStraight = false;
            }
            else if (rand==0) {
                this.isGoingStraight = true;
                this.isGoingUp = false;
                this.isGoingDown = false;
            }
        }

        if (this.isGoingStraight) {
            if (this.randStraightNumber>0) {
                if (this.countHorizontalBlock<50) {
                    this.groundSandXPos += 2;
                    this.countHorizontalBlock++;
                }
                else {
                    this.countHorizontalBlock=0;
                    this.randStraightNumber--;
                }
            }
            else {
                this.isGoingStraight = false;
                this.randStraightNumber = Math.round(Math.random() + 1);
            }
        }
        else if (this.isGoingDown) {
            if (this.countVertivalBlock<10) {
                this.groundSandYPos += 2;
                this.countVertivalBlock++;
            }
            else {
                this.countVertivalBlock = 0;
                this.isGoingDown = false;
                this.isGoingStraight = true;
            }
        }
        else if (this.isGoingUp) {
            if (this.countVertivalBlock<10) {
                this.groundSandYPos -= 2;
                this.countVertivalBlock++;
            }
            else {
                this.countVertivalBlock = 0;
                this.isGoingUp = false;
                this.isGoingStraight = true;
            }
        }

        groundSand.initPosition(this.groundSandXPos, this.groundSandYPos);
        this.lastGroundSandXPos = groundSand.absXCurrentPos;
        this.ground.push(groundSand);
        i++;
    }
}

GameGL.prototype.collisionTest = function (){
    this.collisionY = -1;

    var indexBlock = 0;
   
    for (var i=0; i<this.ground.length; i++) {
        if ((this.ground[i].absXCurrentPos==this.character.absXCurrentPos) || (this.ground[i].absXCurrentPos==this.character.absXCurrentPos+1)) {
            indexBlock = i;
            break;
        }
    }

    if (this.ground.length>0 && this.character.absYCurrentPos>=(this.ground[indexBlock].absYCurrentPos-CHARACTER_HEIGHT)) {
        this.collisionY = this.ground[indexBlock].absYCurrentPos-CHARACTER_HEIGHT;
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
