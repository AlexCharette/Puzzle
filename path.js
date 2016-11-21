var oPath = function() {
  this.oBody = new oPathBody();
  this.oRender = new oPathRender();
  this.oCurrentNode;
  this.cDirection = "";
  this.bIsRunning = false;

  this.init = function() {
    this.oBody.vCurrentPos = this.oBody.vStartPos;
  }
  this.run = function() {
    if ( this.bReachedNode() ) {
      if ( !this.oCurrentNode.sActiveState ) return;
      var cNewDirection = this.oCurrentNode.sActiveState[ 0 ];
      this.setDirection( cNewDirection );
    }
    if ( this.bIsRunning ) {
      this.oRender.renderShape();
    }
    this.move();
  }

  with ( this.oBody ) {
    this.oRender.renderShape = function() {
      this.renderColours();
      rect( vStartPos.x, vStartPos.y, vCurrentPos.x - vStartPos.x, this.iWeight );
    }
  }

  this.move = function() {
    with ( this.oBody ) {
      switch ( this.cDirection ) {
        case "L" :
          vCurrentPos.x++;
        break;
        case "U" :
          vCurrentPos.y--;
        break;
        case "R" :
          vCurrentPos.x--;
        break;
        case "D" :
          vCurrentPos.y++;
        break;
        default :
        break;
      }
    }
  }

  this.receiveCommand = function( spCommand ) {
    if ( spCommand == "run" ) {
      this.bIsRunning = true;
    } else if ( spCommand == "pause" ) {
      this.bIsRunning = false;
    }
  }

  this.bReachedNode = function() {
    if ( this.oBody.vCurrentPos == this.oCurrentNode.oNodeBody.vPosition ) {
      return true;
    }
    return false;
  }

  this.setDirection = function( cpNewDir ) {
    this.cDirection = cpNewDir;
  }
};

var oPathBody = function() {
  this.vStartPos;
  this.vEndPos;
  this.vCurrentPos;

  this.setStartPos = function( vpNewStart ) {
    this.vStartPos = vpNewStart;
  }
  this.setEndPos = function( vpNewEnd ) {
    this.vEndPos = vpNewEnd;
  }
};

var oPathRender = function() {
  this.sColour = "#fff";
  this.iWeight = 20;
  this.renderColours = function() {
    noStroke();
    fill(this.sColour);
  }
};
