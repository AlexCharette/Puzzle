/*
  Contains all code relating to nodes. There are End Nodes and Route Nodes,
  both being made of Node Bodies, which control sizing and position, and
  Node Renders, which handle the visual side of things
*/
// The node body stores position and sizing information, anything relating to the
// node's spatial condition
var oNodeBody = function() {
  this.vPosition;
  this.iSize = vWindowSize.y / 6;

  this.setPosition = function( vpNewPos ) {
    this.vPosition = vpNewPos;
  }

  // Returns true if the node contains a given vector coordinate
  // Used for checking mouse location and path progress
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

// The node render stores colour information and the methods required for drawing
var oNodeRender = function() {
  this.sColour = 'rgb(224, 69, 56)';

  this.setColour = function( spColour ) {
    this.sColour = spColour;
  }

  // Handles the displaying of colour related properties
  // Route and End nodes have differing shapes, so the method for rendering those
  // Are defined in the full objects
  this.renderColours = function() {
    noFill();
    strokeWeight( 10 );
    stroke( this.sColour );
  }
};

// The node type that appears at the beginning and end of each puzzle
// Much simpler than a route node
var oEndNode = function() {
  // Has a "model" and "view" component division
  this.oBody = new oNodeBody();
  this.oRender = new oNodeRender();
  // Flag that, generally, these don't need a key
  this.bNeedsKey = false;

  // Calls all the render functions of the end node,
  // including rendering a key if there is one
  this.render = function( fpOpacity ) {
    this.oRender.renderColours( fpOpacity );
    this.oRender.renderShape();
    if ( this.bNeedsKey ) {
      this.renderKey( fpOpacity );
    }
  }

  // Namespace used to prevent conflicting uses of "this"
  with ( this.oBody ) {
    // Renders the square shape of an end node
    this.oRender.renderShape = function() {
      rect( vPosition.x - ( iSize / 2 ), vPosition.y - ( iSize / 2 ), iSize, iSize );
    }
  }

  // Renders the key
  this.renderKey = function( fpOpacity ) {
    with ( this.oBody ) {
      // A filled arc in the middle of the square (node)
      noStroke();
      fill( 'rgba(68, 206, 224,' + fpOpacity + ')' );
      arc( vPosition.x, vPosition.y, iSize, iSize, TWO_PI + HALF_PI, PI + HALF_PI,  CHORD);
    }
  }
};

// The type of node than can be reconfigured to alter the direction of the path
var oRouteNode = function() {
  // Contains "model" and "view" components
  this.oBody = new oNodeBody();
  this.oRender = new oNodeRender();
  // A matrix of states, which makes for a smoooooth control system
  // Mmmmmmmmmmmm
  this.aasStates = [ [ "UL",     "U",      "UR" ],
                     [ "L", [ "LR", "UD" ], "R" ],
                     [ "DL",     "D",      "DR" ]
                   ];
  // The index of the current state in the matrix
  // Instantiated with 1 to set it at the center
  this.vCurrentIndex = new oVector( 1, 1 );
  this.iIndex_Y = 1;
  this.iIndex_X = 1;
  // Store the previous index, for checking to decide between the center positions, LR and UD
  this.vPreviousIndex = new oVector( this.vCurrentIndex.x, this.vCurrentIndex.y );
  // The active state is whatever string the index is at in the matrix
  // An additional index needs to be specified for the center one
  this.sActiveState = this.aasStates[ this.vCurrentIndex.y ][ this.vCurrentIndex.x ][ 0 ];
  // The node has not yet been crossed
  this.bWasCrossed = false;
  // The node does not have a key
  this.bHasKey = false;

  // Sets an initial shape for the node
  this.init = function() {
    this.setShape();
  }

  // Renders the node and handles which colour is currently needed
  this.render = function( fpOpacity ) {
    if ( this.bIsSelected ) {
      this.oRender.setColour( 'rgba(224, 30, 29, ' + fpOpacity + ')' );
    } else {
      this.oRender.setColour( 'rgba(224, 30, 29, ' + fpOpacity / 2 + ')' );
    }
    if ( this.bWasCrossed ) {
      this.oRender.setColour( 'rgba(106, 224, 110,' + fpOpacity + ')' );
    }
    this.oRender.renderColours();
    this.oRender.renderShape( fpOpacity );
    // Also renders the key if there is one
    if ( this.bHasKey ) {
      this.renderKey( fpOpacity );
    }
  }

  // Renders the shape of the node, in its render component
  // Two triangles are drawn based on the coordinates given to the render component
  this.oRender.renderShape = function() {
    triangle( this.afTriCoords_1[ 0 ].x, this.afTriCoords_1[ 0 ].y, this.afTriCoords_1[ 1 ].x,
              this.afTriCoords_1[ 1 ].y, this.afTriCoords_1[ 2 ].x, this.afTriCoords_1[ 2 ].y );
    triangle( this.afTriCoords_2[ 0 ].x, this.afTriCoords_2[ 0 ].y, this.afTriCoords_2[ 1 ].x,
              this.afTriCoords_2[ 1 ].y, this.afTriCoords_2[ 2 ].x, this.afTriCoords_2[ 2 ].y );
  }

  // Renders the key if there is one
  this.renderKey = function( fpOpacity) {
    with ( this.oBody ) {
      noStroke();
      // Change the colour if the key has been collected
      if ( this.bWasCrossed ) {
        fill( 'rgba(106, 224, 110,' + fpOpacity + ')' );
      } else {
        fill( 'rgba(68, 206, 224,' + ( fpOpacity / 2 ) + ')' );
      }
      // An arc opposite of the one at the end, to indicate relation
      arc( vPosition.x, vPosition.y, iSize, iSize, PI + HALF_PI, TWO_PI + HALF_PI, CHORD);
    }
  }

  // Handles commands passed by the user to the selected node
  this.receiveCommand = function( spCommand ) {
    // Store the previous command index, because things are changing
    this.vPreviousIndex.set( this.iIndex_X, this.iIndex_Y );
    // We move around in the matrix based on which direction was given
    // I'm pretty happy with it
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
    // The shape is then set using the state determined by the current index
    this.setShape();
  }

  // Sets the shape by fetching triangle coordinates
  this.setShape = function() {
    // If we're at the center point of the command matrix,
    // the value could either be UP-DOWN or LEFT-RIGHT
    if ( this.iIndex_Y == 1 && this.iIndex_X == 1 ) {
      // If the command changed in X, indicating a left-right shift,
      if ( this.iIndex_X != this.vPreviousIndex.x ) {
        // Use the LEFT-RIGHT state
        this.sActiveState = this.aasStates[ this.iIndex_Y ][ this.iIndex_X ][ 0 ];
        // If the command changed in Y, indicating a top-down shift,
      } else if ( this.iIndex_Y != this.vPreviousIndex.y ) {
        // Use the UP-DOWN state
        this.sActiveState = this.aasStates[ this.iIndex_Y ][ this.iIndex_X ][ 1 ];
      }
    // Otherwise just get the command at the current index
    } else {
      this.sActiveState = this.aasStates[ this.iIndex_Y ][ this.iIndex_X ];
    }
    if ( !this.sActiveState ) { return; }
    // If there are two possible directions,
    if ( this.sActiveState.length > 1 ) {
      // Differentiate the triangles
      this.oRender.afTriCoords_1 = this.afGetTriCoordsFor( this.sActiveState[ 0 ] );
      this.oRender.afTriCoords_2 = this.afGetTriCoordsFor( this.sActiveState[ 1 ] );
      // Otherwise point them in the same direction
    } else {
      this.oRender.afTriCoords_1 = this.afGetTriCoordsFor( this.sActiveState );
      this.oRender.afTriCoords_2 = this.afGetTriCoordsFor( this.sActiveState );
    }
  }

  // Returns coordinates for the triangles depending on the state
  this.afGetTriCoordsFor = function( spState ) {
    if ( !this.oBody.vPosition ) return;
    // Variables to store the sizing properties and oversets to make SHIT PRETTY
    // Thank you, Pippin, for making me comfortable with writing such unprofessional comments
    // Please don't knock down my grade out of spite
    with ( this.oBody ) {
      var iSizeOffset = ( iSize / 2 );
      var iDiagonalSize = Math.sqrt( Math.pow( iSize, 2 ) * 2 );
      var iDiagonalOffset = iDiagonalSize / 2;
      var iOverlapOffset = 6;
    }
    with ( this.oBody.vPosition ) {
      switch ( spState ) {
        case "U" :
          // Coordinates include a vector for each corner of the triangle, normally pointing
          // to the middle or corner of the original square
          // Refer to trailing comments (ML = mid-left, TM = top-mid, etc)
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
