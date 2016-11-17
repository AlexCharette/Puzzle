
var oNodeBody = function( ipXPos, ipYPos ) {
  this.oPosition = new oVector( ipXPos, ipYPos );
  this.iSize = 0;
  this.setPosition = function( ipNewXPos, ipNewYPos ) {
    this.oPosition.setPosition( ipNewXPos, ipNewYPos );
  }
};

var oNodeShape = function() {
  this.sColour = "";
  this.setColour = function( spColour ) {
    this.sColour = spColour;
  }

  this.render = function( apTri_1, apTri_2 ) {
    noFill();
    strokeWeight( 10 );
    stroke( this.sColour );
    triangle( apTri_1[0], apTri_1[1], apTri_1[2] );
    triangle( apTri_2[0], apTri_2[1], apTri_2[2] );
  }

  this.animateNode = function( apNewTri_1, apNewTri_2 ) {
    // TODO later
  }
};

var oEndNode = function( ipXPos = 0, ipYPos = 0 ) {
  this.oNodeBody = new oNodeBody( ipXPos, ipYPos );
  this.oNodeShape = new oNodeShape();
};

var oRouteNode = function( ipXPos = 0, ipYPos = 0, spBaseState = "A" ) {
  this.oNodeBody = new oNodeBody( ipXPos, ipYPos );
  this.oNodeShape = new oNodeShape();
  this.asStates = [ "E", "A", "R", "RD", "D", "DL", "RL", "L", "LU", "U", "RU" ];
  this.asUDStates = [ "U", "E", "", "A", "D" ];
  this.asLRStates = [ "L", "E", "", "A", "R" ];
  this.sActiveUDState = spBaseState;
  this.sActiveLRState = spBaseState;

  this.receiveCommand = function( spCommand ) {
    // Depending on command
    // Change active state
    switch ( spCommand ) {
      case "up" :
        this.sActiveUDState = eGetPreviousIn(this.asUDStates, this.sActiveUDState);
      break;
      case "down" :
        this.sActiveUDState = eGetNextIn(this.asUDStates, this.sActiveUDState);
      break;
      case "left" :
        this.sActiveLRState = eGetPreviousIn(this.asLRStates, this.sActiveLRState);
      break;
      case "right" :
        this.sActiveLRState = eGetNextIn(this.asLRStates, this.sActiveLRState);
      break;
      default:
      console.log( "Invalid command entered: " + key );
      break;
    }
    this.sActiveState = this.sActiveUDState + this.sActiveLRState;
    this.highShift( this.sActiveState );
  }

  this.highShift = function( spState ) {
    var afTriCoords_1 = [];
    var afTriCoords_2 = [];
    with (this.oNodeBody) {
      switch ( spState ) {
        case "EE" :
        case "E" :
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
        case "EA" :
        case "AE" :
        case "AA" :
        case "A" :
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
        default:
          this.lowShift( spState );
        break;
      }
    }
  }

  this.lowShift = function( spState ) {
    with (this.oNodeBody) {
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
          afTriCoords_2 =
        break;
        default:

        break;
      }
    }
  }
};

function afGetTriCoordsFor(spShape) {
  with (this.oNodeBody) {
    switch ( spState ) {
      case "UE" :
      case "DE" :
        // UP-RIGHT
        return [ [ ipXPos - ( iSize / 2 ), ipYPos - ( iSize / 2 ) ], // TL
                 [ ipXPos + ( iSize / 2 ), ipYPos - ( iSize / 2 ) ], // TR
                 [ ipXPos + ( iSize / 2 ), ipYPos + ( iSize / 2 ) ]  // BR
               ];
        // DOWN-LEFT
        return [ [ ipXPos - ( iSize / 2 ), ipYPos - ( iSize / 2 ) ], // TL
                 [ ipXPos - ( iSize / 2 ), ipYPos + ( iSize / 2 ) ], // BL
                 [ ipXPos + ( iSize / 2 ), ipYPos + ( iSize / 2 ) ]  // BR
               ];
      break;
      case "U" :
        // UP
        return [ [ ipXPos - ( iSize / 2 ), ipYPos ], // ML
                 [ ipXPos, ipYPos - ( iSize / 2 ) ], // TM
                          [ ipXPos + ( iSize / 2 ), ipYPos ]  // MR
               ];
      break;
      case "D" :
        // DOWN
        return [ [ ipXPos + ( iSize / 2 ), ipYPos ], // MR
                 [ ipXPos, ipYPos + ( iSize / 2 ) ], // BM
                 [ ipXPos - ( iSize / 2 ), ipYPos ]  // ML
               ];
      break;
      case "L" :
        // LEFT
        return [ [ ipXPos, ipYPos + ( iSize / 2 ) ], // BM
                 [ ipXPos - ( iSize / 2 ), ipYPos ], // ML
                 [ ipXPos, ipYPos - ( iSize / 2 ) ]  // TM
               ];
      break;
      case "R" :
        // RIGHT
        return [ [ ipXPos, ipYPos - ( iSize / 2 ) ], // TM
                 [ ipXPos + ( iSize / 2 ), ipYPos ], // MR
                 [ ipXPos, ipYPos + ( iSize / 2 ) ]  // BM
               ];
      break;
      default:

      break;
    }
  }
}

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
