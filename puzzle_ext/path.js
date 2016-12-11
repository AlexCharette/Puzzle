var oPathSegment = function( vpPosition, ipSpeed, cpState ) {
  this.vPosition = vpPosition;
  this.cState = cpState;
  this.bIsChanging = true;
  this.iChange = 0;
  this.iIncrement = ipSpeed;
  this.sColour = '#E01E1D';//"#fff";
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
          rect( ( vPosition.x - iOffset ), ( vPosition.y + iOffset ) - iChange, iWeight, iChange );
        break;
        case "D" :
          rect( ( vPosition.x - iOffset ), ( vPosition.y - iOffset ), iWeight, iChange );
        break;
        default:
        break;
      }
    }
  }

  this.setColour = function( spColour ) {
    this.sColour = spColour;
  }
};

var oPath = function() {
  this.oBody = new oPathBody();
  this.aoSegments = [];
  this.oCurrentNode;
  this.cDirection = "R";
  this.bIsRunning = false;
  this.bFoundKey = false;
  this.bUserMadeMistake = false;
  this.bPuzzleSolved = false;

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
      if ( !this.oCurrentNode.bWasCrossed || this.oCurrentNode.sActiveState.length == 1 ) {
        this.setDirection( this.oCurrentNode.sActiveState[ 0 ] );
        this.oCurrentNode.bWasCrossed = true;
      } else {
        this.setDirection( this.oCurrentNode.sActiveState[ 1 ] );
      }
      this.createSegment();
      this.aoSegments[ this.aoSegments.length - 2 ].bIsChanging = false;
    }
    if ( this.bIsRunning ) {
      for ( oSegment of this.aoSegments ) {
        oSegment.run();
      }
      this.move();
    }
  }

  this.render = function() {
    var sMistakeColour = '', sSuccessColour = '',
        sNormalColour = '', sColourToSet = '';
    if ( this.bUserMadeMistake ) {
      sColourToSet = sMistakeColour;
    } else if ( this.bPuzzleSolved ) {
      sColourToSet = sSuccessColour;
    } else {
      sColourToSet = sNormalColour;
    }
    for ( oSegment of this.aoSegments ) {
      oSegment.setColour( sColourToSet );
      oSegment.render();
    }
  }

  this.limitPath = function() {
    var iEdgeLimit = 100;
    var aiLimits = [ 0 + iEdgeLimit, vWindowSize.x - iEdgeLimit, 0 + iEdgeLimit, vWindowSize.y - iEdgeLimit ];
    if ( ( this.oBody.vCurrentPos.x <= aiLimits[ 0 ] || this.oBody.vCurrentPos.x >= aiLimits[ 1 ] ) ||
       ( this.oBody.vCurrentPos.y <= aiLimits[ 2 ] || this.oBody.vCurrentPos.y >= aiLimits[ 3 ] ) ) {
         this.bUserMadeMistake = true;
      this.reset();
    }
  }

  this.reset = function() {
    this.bIsRunning = false;
    this.cDirection = "R";
    while ( this.aoSegments.length ) {
      this.aoSegments.pop();
    }
    this.init();
  }

  this.createSegment = function() {
    var vPathPos = new oVector( this.oBody.vCurrentPos.x, this.oBody.vCurrentPos.y );
    this.aoSegments.push( new oPathSegment( vPathPos, this.oBody.iSpeed, this.cDirection ) );
  }

  this.move = function() {
    this.limitPath();
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

  this.switchState = function() {
      this.bIsRunning = !this.bIsRunning;
  }

  this.bReachedNode = function() {
    if ( !this.oCurrentNode || this.oCurrentNode.bIsFirst ) return;
    var iPositionOffset = 5;
    if ( dist( this.oBody.vCurrentPos.x, this.oBody.vCurrentPos.y,
          this.oCurrentNode.oBody.vPosition.x,
          this.oCurrentNode.oBody.vPosition.y ) < iPositionOffset ) {
          this.checkForKey();
          return true;
    } else {
          return false;
    }
  }

  this.checkForKey = function() {
    if ( this.oCurrentNode.bHasKey ) {
      this.bFoundKey = true;
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
  this.iSpeed = 6;

  this.setStartPos = function( vpNewStart ) {
    this.vStartPos = vpNewStart;
  }
  this.setEndPos = function( vpNewEnd ) {
    this.vEndPos = vpNewEnd;
  }
};
