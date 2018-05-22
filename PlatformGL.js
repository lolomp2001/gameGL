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
    this.collisionLeft = false;
    this.collisionRight = false;
    this.collisionX = -1;
    this.collisionY = -1;
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
                groundSand.isLeftWall = true;;
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
                groundSand.isRightWall = true;
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
    this.collisionLeft = false;
    this.collisionRight = false;
    this.collisionY = -1;
    this.collisionX = -1;

    var indexFirstBlock = -1;
    var indexMiddleBlock = -1;
    var indexLastBlock = -1;

    for (var i=0; i<this.ground.length; i++) {
        if ((this.ground[i].absXCurrentPos)==(this.character.absXCurrentPos-CHARACTER_WIDTH/2) || (this.ground[i].absXCurrentPos+1)==(this.character.absXCurrentPos-CHARACTER_WIDTH/2)) {
            indexFirstBlock = i;
        }
        if ((this.ground[i].absXCurrentPos)==this.character.absXCurrentPos || (this.ground[i].absXCurrentPos+1)==this.character.absXCurrentPos) {
            indexMiddleBlock = i;
        }
        if ((this.ground[i].absXCurrentPos)==(this.character.absXCurrentPos+CHARACTER_WIDTH/2) || (this.ground[i].absXCurrentPos+1)==(this.character.absXCurrentPos+CHARACTER_WIDTH/2)) {
            indexLastBlock = i;
            break;
        }
    }

    if (indexFirstBlock!=-1 && indexMiddleBlock!=-1 && indexLastBlock!=-1) {
        if (this.character.absYCurrentPos>=(this.ground[indexMiddleBlock].absYCurrentPos-CHARACTER_HEIGHT/2)) {
            this.collisionY = this.ground[indexMiddleBlock].absYCurrentPos-CHARACTER_HEIGHT/2;
        }

        for (var i=indexFirstBlock; i<indexMiddleBlock+1; i++){
            if (this.character.charVect[0]==-1) {
                if (this.ground[i].isLeftWall && this.collisionY!=-1) {
                    this.collisionLeft = true;
                    this.collisionX = this.ground[i].absXCurrentPos;
                }
            }
        }
        for (var i=indexLastBlock; i>indexMiddleBlock-1; i--){
            if (this.character.charVect[0]==1) {
                if (this.ground[i].isRightWall && this.collisionY!=-1) {
                    this.collisionRight = true;
                    this.collisionX = this.ground[i].absXCurrentPos;
                }
            }
        }
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
    this.character.updatePosition(this.collisionRight, this.collisionLeft, this.collisionX, this.collisionY);
    this.character.updateTexture();
}

GameGL.prototype.afterCollisionFix = function (){
    this.character.afterCollisionFix(this.collisionRight, this.collisionLeft, this.collisionX, this.collisionY);
}

GameGL.prototype.draw = function (){
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    for (var i=0; i<this.ground.length; i++) {
        this.ground[i].draw();
    }
    this.character.draw();
}
