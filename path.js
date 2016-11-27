var oPath = function() {
  this.oBody = new oPathBody();
  this.oRender = new oPathRender();
  this.oCurrentNode;
  this.cDirection = "R";
  this.bIsRunning = false;

  this.init = function() {
    var vCurrentPos = this.oBody.vStartPos;
    this.oBody.vCurrentPos = new oVector( vCurrentPos.x, vCurrentPos.y );
  }
  this.run = function() {
    if ( this.bReachedNode() ) {
      if ( !this.oCurrentNode.sActiveState ) return;
      this.setDirection( this.oCurrentNode.sActiveState[ 0 ] );
    }
    if ( this.bIsRunning ) {
      this.oRender.renderShape();
      this.move();
    }
  }

  with ( this.oBody ) {
    this.oRender.renderShape = function() {
      this.renderColours();
      rect( vStartPos.x, vStartPos.y, vCurrentPos.x - vStartPos.x, this.iWeight );
    }
  }

  this.move = function() {
    with ( this.oBody ) {
      console.log( this.cDirection )
      switch ( this.cDirection ) {
        case "R" :
          vCurrentPos.x++;
        break;
        case "U" :
          vCurrentPos.y--;
        break;
        case "L" :
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
    if ( !this.oCurrentNode || !this.oBody.vCurrentPos ) return;
    var iPositionOffset = 10;
    if ( this.oBody.vCurrentPos >= this.oCurrentNode.oBody.vPosition - iPositionOffset
        && this.oBody.vCurrentPos <= this.oCurrentNode.oBody.vPosition + iPositionOffset )
    {
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
