
var oNodeBody = function() {
  this.vPosition;
  this.iSize = 50; // TODO set different value
  this.setPosition = function( vpNewPos ) {
    this.vPosition = vpNewPos;
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
    if ( this.oBody.bContains(vMouse) ) console.log("We got one!");
  }
  with ( this.oBody ) {
    this.oRender.renderShape = function() {
      this.renderColours();
      rect( vPosition.x - ( iSize / 2 ), vPosition.y - ( iSize / 2 ), iSize, iSize );
    }
  }

  this.oBody.bContains = function( vCoord ) {
    var iHalfSize = this.iSize / 2;
    with ( this.vPosition ) {
      if ( vCoord.x >= x - iHalfSize && vCoord.x <= x + iHalfSize
           && vCoord.y >= y - iHalfSize && vCoord.y <= y + iHalfSize ) {
        return true;
      } else {
        return false;
      }
    }
  }
};

var oRouteNode = function( spBaseState = "E" ) {
  this.oBody = new oNodeBody();
  this.oRender = new oNodeRender();
  this.asStates = [ "E", "A", "R", "RD", "D", "DL", "RL", "L", "LU", "U", "RU" ];
  this.asUDStates = [ "U", "E", "", "A", "D" ];
  this.asLRStates = [ "L", "E", "", "A", "R" ];
  this.sActiveUDState = spBaseState;
  this.sActiveLRState = spBaseState;
  this.sActiveState = this.sActiveUDState + this.sActiveLRState;

  this.init = function() {
    this.oRender.init( this.setShape( this.sActiveState ) );
  }

  this.run = function() {
    this.oRender.renderShape( this.oBody );
    this.b = this.oBody.bContains( vMouse );
  }

  this.oRender.init = function( pShape ) {
    this.afTriCoords_1 = pShape;
    this.afTriCoords_2 = pShape;
  }

  this.oRender.renderShape = function( oNodeBody ) {
    this.renderColours();
    triangle( this.afTriCoords_1[ 0 ].x, this.afTriCoords_1[ 0 ].y, this.afTriCoords_1[ 1 ].x,
              this.afTriCoords_1[ 1 ].y, this.afTriCoords_1[ 2 ].x, this.afTriCoords_1[ 2 ].y );
    // triangle( this.afTriCoords_2[ 0 ].x, this.afTriCoords_2[ 0 ].y, this.afTriCoords_2[ 1 ].x,
    //           this.afTriCoords_2[ 1 ].y, this.afTriCoords_2[ 2 ].x, this.afTriCoords_2[ 2 ].y );
    var iSizeOffset = oNodeBody.iSize / 2;
    triangle(oNodeBody.vPosition.x - iSizeOffset, oNodeBody.vPosition.y, oNodeBody.vPosition.x, oNodeBody.vPosition.y - iSizeOffset, oNodeBody.vPosition.x + iSizeOffset, oNodeBody.vPosition.y);
    triangle(oNodeBody.vPosition.x + iSizeOffset, oNodeBody.vPosition.y, oNodeBody.vPosition.x, oNodeBody.vPosition.y + iSizeOffset, oNodeBody.vPosition.x - iSizeOffset, oNodeBody.vPosition.y);
  }

  this.oRender.animateNode = function() {
    // TODO later
  }

  // Changes the active state depending on the received command
  this.receiveCommand = function( spCommand ) {
    switch ( spCommand ) {
      case "up" :
        this.sActiveUDState = eGetPreviousIn_From( this.asUDStates, this.sActiveUDState );
        console.log( "Command: " + spCommand + " | State " + this.sActiveUDState );
      break;
      case "down" :
        this.sActiveUDState = eGetNextIn_From( this.asUDStates, this.sActiveUDState );
        console.log( "Command: " + spCommand + " | State " + this.sActiveUDState );
      break;
      case "left" :
        this.sActiveLRState = eGetPreviousIn_From( this.asLRStates, this.sActiveLRState );
        console.log( "Command: " + spCommand + " | State " + this.sActiveLRState );
      break;
      case "right" :
        this.sActiveLRState = eGetNextIn_From( this.asLRStates, this.sActiveLRState );
        console.log( "Command: " + spCommand + " | State " + this.sActiveLRState );
      break;
      default:
      console.log( "Invalid command entered: " + key );
      break;
    }
    this.sActiveState = this.sActiveUDState + this.sActiveLRState;
    this.afGetShape();
  }

  this.afGetShape = function() {
    with ( this.oRender ) {
      if ( this.sActiveState.length > 1 ) {
        if ( this.sActiveState[ 0 ] == "E" || this.sActiveState[ 1 ] == "E" ) {
          afTriCoords_1 = this.afGetTriCoordsFor( "ER" );
          afTriCoords_2 = this.afGetTriCoordsFor( "EL" );
        } else if ( this.sActiveState[ 0 ] == "A" || this.sActiveState[ 1 ] == "A" ) {
          afTriCoords_1 = this.afGetTriCoordsFor( "U" );
          afTriCoords_2 = this.afGetTriCoordsFor( "D" );
        } else {
          afTriCoords_1 = this.afGetTriCoordsFor( this.sActiveState[ 0 ] );
          afTriCoords_2 = this.afGetTriCoordsFor( this.sActiveState[ 1 ] );
        }
      } else {
        afTriCoords_1 = this.afGetTriCoordsFor( this.sActiveState );
      }
    }
  }

  this.afGetTriCoordsFor = function( spState ) {
    if ( !this.oBody.vPosition ) return;
    var iSizeOffset = this.oBody.iSize / 2;
    with ( this.oBody.vPosition ) {
      switch ( spState ) {
        case "ER" :
          return [ [ x - iSizeOffset, y - iSizeOffset ], // TL
                   [ x + iSizeOffset, y - iSizeOffset ], // TR
                   [ x + iSizeOffset, y + iSizeOffset ]  // BR
                 ];
        break;
        case "EL" :
          return [ [ x - iSizeOffset, y - iSizeOffset ], // TL
                   [ x - iSizeOffset, y + iSizeOffset ], // BL
                   [ x + iSizeOffset, y + iSizeOffset ]  // BR
                 ];
        break;
        case "U" :
          return [ [ x - iSizeOffset, y ], // ML
                   [ x, y - iSizeOffset ], // TM
                   [ x + iSizeOffset, y ]  // MR
                 ];
        break;
        case "D" :
          return [ [ x + iSizeOffset, y ], // MR
                   [ x, y + iSizeOffset ], // BM
                   [ x - iSizeOffset, y ]  // ML
                 ];
        break;
        case "L" :
          return [ [ x, y + iSizeOffset ], // BM
                   [ x - iSizeOffset, y ], // ML
                   [ x, y - iSizeOffset ]  // TM
                 ];
        break;
        case "R" :
          return [ [ x, y - iSizeOffset ], // TM
                   [ x + iSizeOffset, y ], // MR
                   [ x, y + iSizeOffset ]  // BM
                 ];
        break;
        default:
        break;
      }
    }
  }

  this.oBody.bContains = function( vCoord ) {
    var iHalfSize = this.iSize / 2;
    with ( this.vPosition ) {
      if ( vCoord.x >= x - iHalfSize && vCoord.x <= x + iHalfSize
           && vCoord.y >= y - iHalfSize && vCoord.y <= y + iHalfSize ) {
        return true;
      } else {
        return false;
      }
    }
  }
};
