
var oNodeBody = function() {
  this.vPosition;
  this.iSize = 200; // TODO set different value
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
  this.sColour = '#FF7440';
  this.setColour = function( spColour ) {
    this.sColour = spColour;
  }
  this.renderColours = function() {
    noFill();
    strokeWeight( 5 );
    stroke( this.sColour );
  }
};

var oEndNode = function() {
  this.oBody = new oNodeBody();
  this.oRender = new oNodeRender();
  this.run = function() {
    this.oRender.renderShape();
  }
  with ( this.oBody ) {
    this.oRender.renderShape = function() {
      this.renderColours();
      rect( vPosition.x - ( iSize / 2 ), vPosition.y - ( iSize / 2 ), iSize, iSize );
    }
  }

};

var oRouteNode = function( spBaseState = "A" ) {
  this.oBody = new oNodeBody();
  this.oRender = new oNodeRender();
  this.asUDStates = [ "U", "", "A", "D" ];
  this.asLRStates = [ "L", "", "A", "R" ];
  this.sActiveUDState = spBaseState;
  this.sActiveLRState = spBaseState;

  this.init = function() {
    this.setShape();
  }

  this.run = function() {
    if ( this.bIsSelected ) {
      this.oRender.setColour( '#3C9C56' );
    }
    this.oRender.renderShape();
  }

  this.oRender.renderShape = function() {
    this.renderColours();
    triangle( this.afTriCoords_1[ 0 ].x, this.afTriCoords_1[ 0 ].y, this.afTriCoords_1[ 1 ].x,
              this.afTriCoords_1[ 1 ].y, this.afTriCoords_1[ 2 ].x, this.afTriCoords_1[ 2 ].y );
    triangle( this.afTriCoords_2[ 0 ].x, this.afTriCoords_2[ 0 ].y, this.afTriCoords_2[ 1 ].x,
              this.afTriCoords_2[ 1 ].y, this.afTriCoords_2[ 2 ].x, this.afTriCoords_2[ 2 ].y );
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
    this.sActiveState = this.sActiveUDState + this.sActiveLRState;
    if ( !this.sActiveState ) { return; } // will return if both states are ""
    if ( this.sActiveState.length > 1 ) {
      if ( this.sActiveState[ 0 ] == "E" || this.sActiveState[ 1 ] == "E" ) {
        this.oRender.afTriCoords_1 = this.afGetTriCoordsFor( "ER" );
        this.oRender.afTriCoords_2 = this.afGetTriCoordsFor( "EL" );
      } else if ( this.sActiveState[ 0 ] == "A" || this.sActiveState == "AA" ) {
        this.oRender.afTriCoords_1 = this.afGetTriCoordsFor( "U" );
        this.oRender.afTriCoords_2 = this.afGetTriCoordsFor( "D" );
      } else if ( this.sActiveState[ 1 ] == "A" ) {
        this.oRender.afTriCoords_1 = this.afGetTriCoordsFor( "L" );
        this.oRender.afTriCoords_2 = this.afGetTriCoordsFor( "R" );
      } else {
        this.oRender.afTriCoords_1 = this.afGetTriCoordsFor( this.sActiveState[ 0 ] );
        this.oRender.afTriCoords_2 = this.afGetTriCoordsFor( this.sActiveState[ 1 ] );
      }
    } else if ( this.sActiveState == "A" ){
      this.oRender.afTriCoords_1 = this.afGetTriCoordsFor( "U");
      this.oRender.afTriCoords_2 = this.afGetTriCoordsFor( "D" );
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
      var iOverlapOffset = 3;
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
