
var oNodeBody = function() {
  this.vPosition;
  this.iSize = 50; // TODO set different value
  this.setPosition = function( vpNewPos ) {
    this.vPosition = vpNewPos;
  }
};

var oNodeRender = function() {
  this.sColour = "#FF7440";
  this.setColour = function( spColour ) {
    this.sColour = spColour;
  }
  this.render = function( apTri_1, apTri_2 ) {
    noFill();
    strokeWeight( 10 );
    stroke( this.sColour );
    // triangle( apTri_1[ 0 ], apTri_1[ 1 ], apTri_1[ 2 ] );
    // triangle( apTri_2[ 0 ], apTri_2[ 1 ], apTri_2[ 2 ] );
  }
};

var oEndNode = function() {
  this.oBody = new oNodeBody();
  this.oRender = new oNodeRender();

  this.run = function() {
    this.oRender.render;
  }
  this.oRender.render = function() {
    this.oRender.render();
    with ( this.oBody ) {
      rect( vPosition.x - ( iSize / 2 ), vPosition.y - ( iSize / 2 ), iSize, iSize );
    }
  }
};

var oRouteNode = function( spBaseState = "A" ) {
  this.oBody = new oNodeBody();
  this.oRender = new oNodeRender();
  this.asStates = [ "E", "A", "R", "RD", "D", "DL", "RL", "L", "LU", "U", "RU" ];
  this.asUDStates = [ "U", "E", "", "A", "D" ];
  this.asLRStates = [ "L", "E", "", "A", "R" ];
  this.sActiveUDState = spBaseState;
  this.sActiveLRState = spBaseState;
  this.sActiveState;

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

  this.oNodeRender.animateNode = function( apNewTri_1, apNewTri_2 ) {
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
    this.shiftShape( this.sActiveState );
  }

  this.shiftShape = function( spState ) {
    var afTriCoords_1 = [];
    var afTriCoords_2 = [];
    if ( spState.length > 1 ) {
      if ( spState[ 1 ] == "E" || spState[ 2 ] == "E" ) {
        afTriCoords_1 = afGetTriCoordsFor( "ER" );
        afTriCoords_2 = afGetTriCoordsFor( "EL" );
      } else if ( spState[ 1 ] == "A" || spState[ 2 ] == "A" ) {
        afTriCoords_1 = afGetTriCoordsFor( "U" );
        afTriCoords_2 = afGetTriCoordsFor( "D" );
      } else {
        afTriCoords_1 = afGetTriCoordsFor( spState[ 0 ] );
        afTriCoords_2 = afGetTriCoordsFor( spState[ 1 ] );
      }
    } else {
      afTriCoords_1 = afGetTriCoordsFor( spState );
    }
  }

  this.afGetTriCoordsFor = function( spState ) {
    with ( this.oBody.vPosition ) {
      switch ( spState ) {
        case "ER" :
          return [ [ x - ( iSize / 2 ), y - ( iSize / 2 ) ], // TL
                   [ x + ( iSize / 2 ), y - ( iSize / 2 ) ], // TR
                   [ x + ( iSize / 2 ), y + ( iSize / 2 ) ]  // BR
                 ];
        break;
        case "EL" :
          return [ [ x - ( iSize / 2 ), y - ( iSize / 2 ) ], // TL
                   [ x - ( iSize / 2 ), y + ( iSize / 2 ) ], // BL
                   [ x + ( iSize / 2 ), y + ( iSize / 2 ) ]  // BR
                 ];
        break;
        case "U" :
          return [ [ x - ( iSize / 2 ), y ], // ML
                   [ x, y - ( iSize / 2 ) ], // TM
                   [ x + ( iSize / 2 ), y ]  // MR
                 ];
        break;
        case "D" :
          return [ [ x + ( iSize / 2 ), y ], // MR
                   [ x, y + ( iSize / 2 ) ], // BM
                   [ x - ( iSize / 2 ), y ]  // ML
                 ];
        break;
        case "L" :
          return [ [ x, y + ( iSize / 2 ) ], // BM
                   [ x - ( iSize / 2 ), y ], // ML
                   [ x, y - ( iSize / 2 ) ]  // TM
                 ];
        break;
        case "R" :
          return [ [ x, y - ( iSize / 2 ) ], // TM
                   [ x + ( iSize / 2 ), y ], // MR
                   [ x, y + ( iSize / 2 ) ]  // BM
                 ];
        break;
        default:
        break;
      }
    }
  }
};



/* STORING OLD COORD RETRIEVAL MODE


  switch ( spState ) {
    case "UL" :
      // UP
      afTriCoords_1 = [ [ ipXPos - ( iSize / 2 ), ipYPos ], // ML
                        [ ipXPos, ipYPos - ( iSize / 2 ) ], // TM
                        [ ipXPos + ( iSize / 2 ), ipYPos ]  // MR
                      ];
      // LEFT
      afTriCoords_2 = [ [ ipXPos, ipYPos + ( iSize / 2 ) ], // BM
                        [ ipXPos - ( iSize / 2 ), ipYPos ], // ML
                        [ ipXPos, ipYPos - ( iSize / 2 ) ]  // TM
                      ];
    break;
    case "UR" :
      // UP
      afTriCoords_1 = [ [ ipXPos - ( iSize / 2 ), ipYPos ], // ML
                        [ ipXPos, ipYPos - ( iSize / 2 ) ], // TM
                        [ ipXPos + ( iSize / 2 ), ipYPos ]  // MR
                      ];
      // RIGHT
      afTriCoords_2 = [ [ ipXPos, ipYPos - ( iSize / 2 ) ], // TM
                        [ ipXPos + ( iSize / 2 ), ipYPos ], // MR
                        [ ipXPos, ipYPos + ( iSize / 2 ) ]  // BM
                      ];
    break;
    case "DL" :
      // DOWN
      afTriCoords_1 = [ [ ipXPos + ( iSize / 2 ), ipYPos ], // MR
                        [ ipXPos, ipYPos + ( iSize / 2 ) ], // BM
                        [ ipXPos - ( iSize / 2 ), ipYPos ]  // ML
                      ];
      // LEFT
      afTriCoords_2 = [ [ ipXPos, ipYPos + ( iSize / 2 ) ], // BM
                        [ ipXPos - ( iSize / 2 ), ipYPos ], // ML
                        [ ipXPos, ipYPos - ( iSize / 2 ) ]  // TM
                      ];
    break;
    case "DR" :
      // DOWN
      afTriCoords_1 = [ [ ipXPos + ( iSize / 2 ), ipYPos ], // MR
                        [ ipXPos, ipYPos + ( iSize / 2 ) ], // BM
                        [ ipXPos - ( iSize / 2 ), ipYPos ]  // ML
                      ];
      // RIGHT
      afTriCoords_2 = [ [ ipXPos, ipYPos - ( iSize / 2 ) ], // TM
                        [ ipXPos + ( iSize / 2 ), ipYPos ], // MR
                        [ ipXPos, ipYPos + ( iSize / 2 ) ]  // BM
                      ];
    break;
    case "UE" :
    case "DE" :
      // UP-RIGHT
      afTriCoords_1 = [ [ ipXPos - ( iSize / 2 ), ipYPos - ( iSize / 2 ) ], // TL
                        [ ipXPos + ( iSize / 2 ), ipYPos - ( iSize / 2 ) ], // TR
                        [ ipXPos + ( iSize / 2 ), ipYPos + ( iSize / 2 ) ]  // BR
                      ];
      // DOWN-LEFT
      afTriCoords_2 = [ [ ipXPos - ( iSize / 2 ), ipYPos - ( iSize / 2 ) ], // TL
                        [ ipXPos - ( iSize / 2 ), ipYPos + ( iSize / 2 ) ], // BL
                        [ ipXPos + ( iSize / 2 ), ipYPos + ( iSize / 2 ) ]  // BR
                      ];
    break;
    case "UA" :
    case "DA" :
      // UP
      afTriCoords_1 = [ [ ipXPos - ( iSize / 2 ), ipYPos ], // ML
                        [ ipXPos, ipYPos - ( iSize / 2 ) ], // TM
                        [ ipXPos + ( iSize / 2 ), ipYPos ]  // MR
                      ];
      // DOWN
      afTriCoords_2 = [ [ ipXPos + ( iSize / 2 ), ipYPos ], // MR
                        [ ipXPos, ipYPos + ( iSize / 2 ) ], // BM
                        [ ipXPos - ( iSize / 2 ), ipYPos ]  // ML
                      ];
    break;
    case "U" :
      // UP
      afTriCoords_1 = [ [ ipXPos - ( iSize / 2 ), ipYPos ], // ML
                        [ ipXPos, ipYPos - ( iSize / 2 ) ], // TM
                        [ ipXPos + ( iSize / 2 ), ipYPos ]  // MR
                      ];
    break;
    case "D" :
      // DOWN
      afTriCoords_1 = [ [ ipXPos + ( iSize / 2 ), ipYPos ], // MR
                        [ ipXPos, ipYPos + ( iSize / 2 ) ], // BM
                        [ ipXPos - ( iSize / 2 ), ipYPos ]  // ML
                      ];
    break;
    case "L" :
      // LEFT
      afTriCoords_2 = [ [ ipXPos, ipYPos + ( iSize / 2 ) ], // BM
                        [ ipXPos - ( iSize / 2 ), ipYPos ], // ML
                        [ ipXPos, ipYPos - ( iSize / 2 ) ]  // TM
                      ];
    break;
    case "R" :
      // RIGHT
      afTriCoords_2 = [ [ ipXPos, ipYPos - ( iSize / 2 ) ], // TM
                        [ ipXPos + ( iSize / 2 ), ipYPos ], // MR
                        [ ipXPos, ipYPos + ( iSize / 2 ) ]  // BM
                      ];
    break;
    default:

    break;
  }

*/
