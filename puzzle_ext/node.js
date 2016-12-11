
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
  this.aasStates = [ [ "UL",     "U",      "UR" ],
                     [ "L", [ "LR", "UD" ], "R" ],
                     [ "DL",     "D",      "DR" ]
                   ];
  this.iIndex_Y = 1;
  this.iIndex_X = 1;
  this.vPreviousIndex = new oVector( this.iIndex_X, this.iIndex_Y );
  this.sActiveState = this.aasStates[ this.iIndex_Y ][ this.iIndex_X ][ 0 ];
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

  this.receiveCommand = function( spCommand ) {
    this.vPreviousIndex.set( this.iIndex_X, this.iIndex_Y );
    switch ( spCommand ) {
      case "up" :
        if ( this.iIndex_Y > 0 ) {
         this.iIndex_Y--;
        }
        console.log( "Command: " + spCommand + " | State: " + this.sActiveState );
      break;
      case "down" :
        if ( this.iIndex_Y < this.aasStates.length - 1 ) {
         this.iIndex_Y++;
        }
        console.log( "Command: " + spCommand + " | State: " + this.sActiveState );
      break;
      case "left" :
        if ( this.iIndex_X > 0 ) {
         this.iIndex_X--;
        }
        console.log( "Command: " + spCommand + " | State: " + this.sActiveState );
      break;
      case "right" :
        if ( this.iIndex_X < this.aasStates[ this.iIndex_Y ].length - 1 ) {
         this.iIndex_X++;
        }
        console.log( "Command: " + spCommand + " | State: " + this.sActiveState );
      break;
      default:
      console.log( "Invalid command entered: " + key );
      break;
    }
    console.log( " X: " + this.iIndex_X + ", Y : " + this.iIndex_Y )
    this.setShape();
  }

  this.setShape = function() {
    if ( this.iIndex_Y == 1 && this.iIndex_X == 1 ) {
      if ( this.iIndex_X != this.vPreviousIndex.x ) {
        this.sActiveState = this.aasStates[ this.iIndex_Y ][ this.iIndex_X ][ 0 ];
      } else if ( this.iIndex_Y != this.vPreviousIndex.y ) {
        this.sActiveState = this.aasStates[ this.iIndex_Y ][ this.iIndex_X ][ 1 ];
      }
    } else {
      this.sActiveState = this.aasStates[ this.iIndex_Y ][ this.iIndex_X ];
    }
    console.log( this.sActiveState )
    if ( !this.sActiveState ) { return; } // will return if both states are ""
    if ( this.sActiveState.length > 1 ) {
      this.oRender.afTriCoords_1 = this.afGetTriCoordsFor( this.sActiveState[ 0 ] );
      this.oRender.afTriCoords_2 = this.afGetTriCoordsFor( this.sActiveState[ 1 ] );
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
