var oPathSegment = function( vpPosition, ipSpeed, cpState ) {
  this.vPosition = vpPosition;
  this.cState = cpState;
  this.bIsChanging = true;
  this.iChange = 0;
  this.iIncrement = ipSpeed;
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
    if ( this.bIsRunning ) {
      for ( oSegment of this.aoSegments ) {
        oSegment.run();
      }
      this.limitPath();
      this.move();
    }
    for ( oSegment of this.aoSegments ) {
      oSegment.render();
    }
  }

  this.limitPath = function() {
    var iEdgeLimit = 100;
    var aiLimits = [ 0 + iEdgeLimit, vWindowSize.x - iEdgeLimit, 0 + iEdgeLimit, vWindowSize.y - iEdgeLimit ];
    if ( ( this.oBody.vCurrentPos.x <= aiLimits[ 0 ] || this.oBody.vCurrentPos.x >= aiLimits[ 1 ] ) ||
       ( this.oBody.vCurrentPos.y <= aiLimits[ 2 ] || this.oBody.vCurrentPos.y >= aiLimits[ 3 ] ) ) {
      this.reset();
    }
  }

  this.reset = function() {
    this.oBody.vCurrentPos = this.oBody.vStartPos;
    this.bIsRunning = false;
    this.cDirection = "R";
    while ( this.aoSegments.length ) {
      this.aoSegments.pop();
    }
    this.createSegment();
  }

  this.createSegment = function() {
    var vPathPos = new oVector( this.oBody.vCurrentPos.x, this.oBody.vCurrentPos.y );
    this.aoSegments.push( new oPathSegment( vPathPos, this.oBody.iSpeed, this.cDirection ) );
  }

  this.move = function() {
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
    var iPositionOffset = 5;
    if ( dist( this.oBody.vCurrentPos.x, this.oBody.vCurrentPos.y,
          this.oCurrentNode.oBody.vPosition.x,
          this.oCurrentNode.oBody.vPosition.y ) < iPositionOffset ) {
          console.log( this.oCurrentNode )
          console.log( this.oCurrentNode.oBody.vPosition.x )
          console.log( this.oCurrentNode.sActiveState[ 0 ] )
          return true;
        } else {
          return false;
        }
  }

  this.setDirection = function( cpNewDir ) {
    this.cDirection = cpNewDir;
  }
};

var oPathBody = function() {
  this.vStartPos;
  this.vEndPos;
  this.vCurrentPos;
  this.iSpeed = 3;

  this.setStartPos = function( vpNewStart ) {
    this.vStartPos = vpNewStart;
  }
  this.setEndPos = function( vpNewEnd ) {
    this.vEndPos = vpNewEnd;
  }
};
