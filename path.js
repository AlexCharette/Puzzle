var oPath = function() {
  this.oBody = new oPathBody();
  this.oRender = new oPathRender();
};

var oPathBody = function() {
  this.oCurrentNode;
  this.vStartPos;
  this.vEndPos;
  this.vCurrentPos;
  this.cDirection = "";
  this.bIsRunning = false;
  this.run = function() {
    if ( this.bReachedNode() ) {
      if ( !this.oCurrentNode.sActiveState ) return;
      var cNewDirection = this.oCurrentNode.sActiveState[ 0 ];
      this.setDirection( cNewDirection );
    }
    this.move();
  }
  this.receiveCommand = function( spCommand ) {
    if ( spCommand == "run" ) {
      this.bIsRunning = true;
    } else if ( spCommand == "pause" ) {
      this.bIsRunning = false;
    }
  }
  this.move = function() {
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
  this.bReachedNode = function() {
    if ( this.vCurrentPos == this.oCurrentNode.oNodeBody.vPosition ) {
      return true;
    }
    return false;
  }
  this.setStartPos = function( vpNewStart ) {
    this.vStartPos = vpNewStart;
  }
  this.setEndPos = function( vpNewEnd ) {
    this.vEndPos = vpNewEnd;
  }
  this.setDirection = function( cpNewDir ) {
    this.cDirection = cpNewDir;
  }
};

var oPathRender = function() {
  this.sColour = "";
  this.iWeight = 0;
  this.render = function() {

  }
};
