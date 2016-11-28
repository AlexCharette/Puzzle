var oPathSegment = function( vpPosition, cpState ) {
  this.vPosition = vpPosition;
  this.cState = cpState;
  this.bIsChanging = true;
  this.iChange = 0;
  this.iIncrement = 3;
  this.sColour = "#fff";
  this.iWeight = 20;

  this.run = function() {
    if ( this.bIsChanging ) {
      this.iChange += this.iIncrement;
    }
  }

  this.render = function() {
    with ( this ) {
      var iOffset = ( iWeight / 2 );
      noStroke();
      fill( sColour );
      switch ( cState ) {
        case "L" :
          rect( ( vPosition.x - iOffset ) - iChange, ( vPosition.y - iOffset ), iChange, iWeight );
        break;
        case "R" :
          rect( ( vPosition.x - iOffset ), ( vPosition.y - iOffset ), iChange, iWeight );
        break;
        case "U" :
          rect( ( vPosition.x - iOffset ), ( vPosition.y - iOffset ) - iChange, iWeight, iChange );
        break;
        case "D" :
          rect( ( vPosition.x - iOffset ), ( vPosition.y - iOffset ), iWeight, iChange );
        break;
        default:
        break;
      }
    }
  }
};

var oPath = function() {
  this.oBody = new oPathBody();
  this.aoSegments = [];
  this.oCurrentNode;
  this.cDirection = "R";
  this.bIsRunning = false;

  this.init = function() {
    var vTempPos = this.oBody.vStartPos;
    this.oBody.vCurrentPos = new oVector( vTempPos.x, vTempPos.y );
    this.createSegment();
  }

  this.run = function() {
    if ( this.bReachedNode() && this.oCurrentNode.bIsLast ) {
      this.bIsRunning = false;
    } else if ( this.bReachedNode() ) {
      if ( !this.oCurrentNode.sActiveState ) return;
      this.setDirection( this.oCurrentNode.sActiveState[ 0 ] );
      this.createSegment();
      this.aoSegments[ this.aoSegments.length - 2 ].bIsChanging = false;
    }
    for ( oSegment of this.aoSegments ) {
      if ( this.bIsRunning ) // TODO FIX BUG
        oSegment.run();
      oSegment.render();
    }
    this.move();
  }

  this.createSegment = function() {
    var vPathPos = new oVector( this.oBody.vCurrentPos.x, this.oBody.vCurrentPos.y );
    this.aoSegments.push( new oPathSegment( vPathPos, this.cDirection ) );
  }

  this.move = function() {
    var iSpeed = 3;
    with ( this.oBody ) {
      switch ( this.cDirection ) {
        case "R" :
          vCurrentPos.x += iSpeed;
        break;
        case "U" :
          vCurrentPos.y -= iSpeed;
        break;
        case "L" :
          vCurrentPos.x -= iSpeed;
        break;
        case "D" :
          vCurrentPos.y += iSpeed;
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
    if ( !this.oCurrentNode || this.oCurrentNode.bIsFirst ) return;
    var iPositionOffset = 1;
    if ( dist( this.oBody.vCurrentPos.x, this.oBody.vCurrentPos.y,
          this.oCurrentNode.oBody.vPosition.x,
          this.oCurrentNode.oBody.vPosition.y ) < iPositionOffset ) {
          return true;
        } else {
          return false;
        }
  }

  this.setDirection = function( cpNewDir ) {
    if ( cpNewDir == "A" ) {
      if ( this.cDirection == "D" ) {
        this.cDirection = "U";
      } else if ( this.cDirection == "U" ) {
        this.cDirection = "D";
      } else if ( this.cDirection == "L" ) {
        this.cDirection = "R";
      } else if ( this.cDirection == "R" ) {
        this.cDirection = "L";
      }
    } else {
      this.cDirection = cpNewDir;
    }
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
