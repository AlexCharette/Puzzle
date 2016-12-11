
var oNodeBody = function() {
  this.vPosition;
  this.iSize = vWindowSize.y / 6; // TODO set different value
  this.setPosition = function( vpNewPos ) {
    this.vPosition = vpNewPos;
  }

  this.bContains = function( vCoord ) {
    var iHalfSize = this.iSize / 2;
    with ( this.vPosition ) {
      if ( vCoord.x >= x - iHalfSize && vCoord.x <= x + iHalfSize
           && vCoord.y >= y - iHalfSize && vCoord.y <= y + iHalfSize
         ) {
        return true;
      } else {
        return false;
      }
    }
  }
};

var oNodeRender = function() {
  this.sColour = 'rgb(224, 30, 29)';//'#FF7440';
  this.setColour = function( spColour ) {
    this.sColour = spColour;
  }
  this.renderColours = function() {
    noFill();
    strokeWeight( 10 );
    stroke( this.sColour );
  }
};

var oEndNode = function() {
  this.oBody = new oNodeBody();
  this.oRender = new oNodeRender();
  this.bNeedsKey = false;

  this.render = function( fpOpacity ) {
    this.oRender.renderShape( fpOpacity );
    if ( this.bNeedsKey ) {
      this.renderKey( fpOpacity );
    }
  }

  with ( this.oBody ) {
    this.oRender.renderShape = function( fpOpacity ) {
      this.renderColours( fpOpacity );
      rect( vPosition.x - ( iSize / 2 ), vPosition.y - ( iSize / 2 ), iSize, iSize );
    }
  }

  this.renderKey = function( fpOpacity ) {
    with ( this.oBody ) {
      noStroke();
      fill( 'rgba(67, 120, 181, ' + fpOpacity + ')' );
      arc( vPosition.x, vPosition.y, iSize, iSize, TWO_PI + HALF_PI, PI + HALF_PI,  CHORD);
    }
  }
};

var oRouteNode = function() {
  this.oBody = new oNodeBody();
  this.oRender = new oNodeRender();
  this.asUDStates = [ "U", "", "A", "D" ];
  this.asLRStates = [ "L", "", "A", "R" ];
  this.aasStates = [ [ "UL",     "U",      "UR" ],
                     [ "L", [ "LR", "UD" ], "R" ],
                     [ "DL",     "D",      "DR" ]
                   ];
  var iIndex_Y = 1;
  var iIndex_X = 1;
  this.sActiveState = this.aasStates[ iIndex_Y ][ iIndex_X ].x;
  this.sActiveUDState = spBaseState;
  this.sActiveLRState = spBaseState;
  this.bWasCrossed = false;
  this.bHasKey = false;

  this.init = function() {
    this.setShape();
  }

  this.render = function( fpOpacity ) {
    if ( this.bIsSelected ) {
      this.oRender.setColour( 'rgba(67, 120, 181, ' + fpOpacity + ')' );//'#3C9C56' );
    } else {
      this.oRender.setColour( 'rgba(224, 30, 29, ' + fpOpacity + ')' ); //'#FF7440' );
    }
    this.oRender.renderShape( fpOpacity );
    if ( this.bHasKey ) {
      this.renderKey( fpOpacity );
    }
  }

  this.oRender.renderShape = function() {
    this.renderColours();
    triangle( this.afTriCoords_1[ 0 ].x, this.afTriCoords_1[ 0 ].y, this.afTriCoords_1[ 1 ].x,
              this.afTriCoords_1[ 1 ].y, this.afTriCoords_1[ 2 ].x, this.afTriCoords_1[ 2 ].y );
    triangle( this.afTriCoords_2[ 0 ].x, this.afTriCoords_2[ 0 ].y, this.afTriCoords_2[ 1 ].x,
              this.afTriCoords_2[ 1 ].y, this.afTriCoords_2[ 2 ].x, this.afTriCoords_2[ 2 ].y );
  }

  this.renderKey = function( fpOpacity) {
    with ( this.oBody ) {
      noStroke();
      fill( 'rgba(67, 120, 181, ' + fpOpacity + ')' );
      arc( vPosition.x, vPosition.y, iSize, iSize, PI + HALF_PI, TWO_PI + HALF_PI, CHORD);
    }
  }

  this.receiveCommand_TEST = function( spCommand ) {
    switch ( spCommand ) {
      case "up" :
        if ( iIndex_Y > 0 ) {
         iIndex_Y--;
        }
        console.log( "Command: " + spCommand + " | State: " + this.sActiveUDState );
      break;
      case "down" :
        if ( iIndex_Y > this.aasStates.length - 1 ) {
         iIndex_Y++;
        }
        console.log( "Command: " + spCommand + " | State: " + this.sActiveUDState );
      break;
      case "left" :
        if ( iIndex_X > 0 ) {
         iIndex_X--;
        }
        console.log( "Command: " + spCommand + " | State: " + this.sActiveLRState );
      break;
      case "right" :
        if ( iIndex_X > this.aasStates[ iIndex_Y ].length - 1 ) {
         iIndex_X++;
        }
        console.log( "Command: " + spCommand + " | State: " + this.sActiveLRState );
      break;
      default:
      console.log( "Invalid command entered: " + key );
      break;
    }
    this.setShape();
  }

  // Changes the active state depending on the received command
  this.receiveCommand = function( spCommand ) {
    switch ( spCommand ) {
      case "up" :
        this.sActiveUDState = eGetPreviousIn_From( this.asUDStates, this.sActiveUDState );
        console.log( "Command: " + spCommand + " | State: " + this.sActiveUDState );
      break;
      case "down" :
        this.sActiveUDState = eGetNextIn_From( this.asUDStates, this.sActiveUDState );
        console.log( "Command: " + spCommand + " | State: " + this.sActiveUDState );
      break;
      case "left" :
        this.sActiveLRState = eGetPreviousIn_From( this.asLRStates, this.sActiveLRState );
        console.log( "Command: " + spCommand + " | State: " + this.sActiveLRState );
      break;
      case "right" :
        this.sActiveLRState = eGetNextIn_From( this.asLRStates, this.sActiveLRState );
        console.log( "Command: " + spCommand + " | State: " + this.sActiveLRState );
      break;
      default:
      console.log( "Invalid command entered: " + key );
      break;
    }
    this.setShape();
  }

  this.setShape = function() { // TODO clean up
    this.sActiveState = this.aasStates[ iIndex_Y ][ iIndex_X ];
    if ( !this.sActiveState ) { return; } // will return if both states are ""
    if ( this.sActiveState.length > 1 ) {
      if ( this.sActiveState[ 0 ] == "A" || this.sActiveState == "AA" ) {
        this.sActiveState = "UD";
      } else if ( this.sActiveState[ 1 ] == "A" ) {
        this.sActiveState = "LR";
      }
      this.oRender.afTriCoords_1 = this.afGetTriCoordsFor( this.sActiveState[ 0 ] );
      this.oRender.afTriCoords_2 = this.afGetTriCoordsFor( this.sActiveState[ 1 ] );
    } else if ( this.sActiveState == "A" ) {
      this.oRender.afTriCoords_1 = this.afGetTriCoordsFor( "U");
      this.oRender.afTriCoords_2 = this.afGetTriCoordsFor( "D" );
      this.sActiveState = "UD";
    } else {
      this.oRender.afTriCoords_1 = this.afGetTriCoordsFor( this.sActiveState );
      this.oRender.afTriCoords_2 = this.afGetTriCoordsFor( this.sActiveState );
    }
  }

  this.afGetTriCoordsFor = function( spState ) {
    if ( !this.oBody.vPosition ) return;
    with ( this.oBody ) {
      var iSizeOffset = ( iSize / 2 );
      var iDiagonalSize = Math.sqrt( Math.pow( iSize, 2 ) * 2 );
      var iDiagonalOffset = iDiagonalSize / 2;
      var iOverlapOffset = 6;
    }
    with ( this.oBody.vPosition ) {
      switch ( spState ) {
        case "ER" :
          return [ new oVector( x - iSizeOffset, y - iSizeOffset ), // TL
                   new oVector( x + iSizeOffset, y - iSizeOffset ), // TR
                   new oVector( x + iSizeOffset, y + iSizeOffset )  // BR
                 ];
        break;
        case "EL" :
          return [ new oVector( x - iSizeOffset, y - iSizeOffset ), // TL
                   new oVector( x - iSizeOffset, y + iSizeOffset ), // BL
                   new oVector( x + iSizeOffset, y + iSizeOffset )  // BR
                 ];
        break;
        case "U" :
          return [ new oVector( x - iDiagonalOffset, y - iOverlapOffset ),     // ML
                   new oVector( x, y - ( iDiagonalOffset + iOverlapOffset ) ), // TM
                   new oVector( x + iDiagonalOffset, y - iOverlapOffset )      // MR
                 ];
        break;
        case "D" :
          return [ new oVector( x + iDiagonalOffset, y + iOverlapOffset ),     // MR
                   new oVector( x, y + ( iDiagonalOffset + iOverlapOffset ) ), // BM
                   new oVector( x - iDiagonalOffset, y + iOverlapOffset )      // ML
                 ];
        break;
        case "L" :
          return [ new oVector( x - iOverlapOffset, y + iDiagonalOffset ),     // BM
                   new oVector( x - ( iDiagonalOffset + iOverlapOffset ), y ), // ML
                   new oVector( x - iOverlapOffset, y - iDiagonalOffset )      // TM
                 ];
        break;
        case "R" :
          return [ new oVector( x + iOverlapOffset, y - iDiagonalOffset ),     // TM
                   new oVector( x + ( iDiagonalOffset + iOverlapOffset ), y ), // MR
                   new oVector( x + iOverlapOffset, y + iDiagonalOffset )      // BM
                 ];
        break;
        default:
        break;
      }
    }
  }
};
