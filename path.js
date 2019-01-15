/*
  Contains all code relating to the path (the path object itself and the segments
  that compose it)
*/
// Each segment of the path needs to have its size and position controlled
var oPathSegment = function( vpPosition, ipSpeed, cpState ) {
  this.vPosition = vpPosition;
  // Store the state which will determine the direction of the segment
  this.cState = cpState;
  // Flag whether or not we're meant to be moving
  this.bIsChanging = true;
  this.iChange = 0;
  this.iIncrement = ipSpeed;
  this.sColour = '#E01E1D';
  this.iWeight = 20;

  // Changes the value of the "change" member variable if it's meant to be changing
  this.run = function() {
    if ( this.bIsChanging ) {
      this.iChange += this.iIncrement;
    }
  }

  // Renders the segment, which involves drawing it and modifying the variables to give
  // the illusion of movement
  this.render = function() {
    with ( this ) {
      var iOffset = ( iWeight / 2 );
      noStroke();
      fill( sColour );
      // Increment different values based on the direction
      switch ( cState ) {
        // For example, Left would involve offsetting the origin while also increasing the width,
        // to make it look like the rectangle is reversing
        case "L" :
          rect( ( vPosition.x + iOffset ) - iChange, ( vPosition.y - iOffset ), iChange, iWeight );
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

  // Sets the colour of the segment
  this.setColour = function( spColour ) {
    this.sColour = spColour;
  }
};

// The actual path, which is a collection of segments
var oPath = function() {
  // The body allows us to keep track of the current and original
  this.oBody = new oPathBody();
  // Hold all of the segments
  this.aoSegments = [];
  // Know which node we're at
  this.oCurrentNode;
  // Have a direction to pass to the segments
  this.cDirection = "R";
  // Know whether or not we're running or paused
  this.bIsRunning = false;
  // Know whether or not we found a key
  this.bFoundKey = false;
  // Know whether or not the user made a mistake or solved the puzzle
  this.bUserMadeMistake = false;
  this.bPuzzleSolved = false;

  // Initializes the member variables and initial position
  this.init = function() {
    this.bUserMadeMistake = false;
    this.bPuzzleSolved = false;
    this.cDirection = "R";
    // Make a copy of the position, as the vector object will be passed by reference
    var vTempPos = this.oBody.vStartPos;
    this.oBody.vCurrentPos = new oVector( vTempPos.x, vTempPos.y );
    // Create a first segment
    this.createSegment();
  }

  // Executes the looping functions of the path
  this.run = function() {
    // Stop the path if the last node is reached
    if ( this.bReachedNode() && this.oCurrentNode.bIsLast ) {
      this.bIsRunning = false;
      // If we've reached any other node,
    } else if ( this.bReachedNode() ) {
      if ( !this.oCurrentNode.sActiveState ) return;
      // If the node wasn't crossed or there's only one direction to it,
      if ( !this.oCurrentNode.bWasCrossed || this.oCurrentNode.sActiveState.length == 1 ) {
        // Change the direction using the first command (char) found
        this.setDirection( this.oCurrentNode.sActiveState[ 0 ] );
        // The node has been crossed
        this.oCurrentNode.bWasCrossed = true;
        // If the node was crossed and there is another direction to take,
      } else {
        // Take it
        this.setDirection( this.oCurrentNode.sActiveState[ 1 ] );
      }
      // Create a new segment
      this.createSegment();
      // Stop the previous one from moving
      this.aoSegments[ this.aoSegments.length - 2 ].bIsChanging = false;
    }
    // If we're running,
    if ( this.bIsRunning ) {
      // Run all the segments
      for ( oSegment of this.aoSegments ) {
        oSegment.run();
      }
      // Call the method that makes the path keep moving
      this.move();
    }
  }

  // Renders the segments and handles colour changes
  this.render = function( fpOpacity ) {
    // Have different colours for base, mistake, and success states
    var sMistakeColour = 'rgba(224, 69, 56,' + fpOpacity + ')',
        sSuccessColour = 'rgba(106, 224, 110,' + fpOpacity + ')',
        sNormalColour = 'rgba(68, 206, 224,' + fpOpacity + ')',
        sColourToSet = '';
    // Set them according to the appropriate scenario
    if ( this.bUserMadeMistake ) {
      sColourToSet = sMistakeColour;
    } else if ( this.bPuzzleSolved ) {
      sColourToSet = sSuccessColour;
    } else {
      sColourToSet = sNormalColour;
    }
    // Apply whatever colour to all the segments and render them
    for ( oSegment of this.aoSegments ) {
      oSegment.setColour( sColourToSet );
      oSegment.render();
    }
  }

  // Limits the path so that it will stop before reaching an edge
  this.limitPath = function() {
    var iEdgeLimit = 100;
    // The different limits of the path according to the borders of the screen
    var aiLimits = [ 0 + iEdgeLimit, vWindowSize.x - iEdgeLimit, 0 + iEdgeLimit, vWindowSize.y - iEdgeLimit ];
    if ( ( this.oBody.vCurrentPos.x <= aiLimits[ 0 ] || this.oBody.vCurrentPos.x >= aiLimits[ 1 ] ) ||
       ( this.oBody.vCurrentPos.y <= aiLimits[ 2 ] || this.oBody.vCurrentPos.y >= aiLimits[ 3 ] ) ) {
      // Stop everything and indicate that a mistake was made
      this.bUserMadeMistake = true;
      this.bIsRunning = false;
      // Give the user time to see, and then return to the initial state
      with ( this ) {
        setTimeout(reset, 750);
      }
    }
  }

  // Namespace used to avoid conflict with "window" object from the timeout function
  with ( this ) {
    // Removes all segments and reinitializes
    this.reset = function() {
      while ( aoSegments.length ) {
        aoSegments.pop();
      }
      init();
    }
  }

  // Adds a new segment to the array
  this.createSegment = function() {
    var vPathPos = new oVector( this.oBody.vCurrentPos.x, this.oBody.vCurrentPos.y );
    this.aoSegments.push( new oPathSegment( vPathPos, this.oBody.iSpeed, this.cDirection ) );
  }

  // Moves the spearhead of the path forward depending on direction
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

  // Changes between running and paused state
  this.switchState = function() {
      this.bIsRunning = !this.bIsRunning;
  }

  // Returns true if a node has been reached
  this.bReachedNode = function() {
    if ( !this.oCurrentNode || this.oCurrentNode.bIsFirst ) return;
    var iPositionOffset = 5;
    if ( dist( this.oBody.vCurrentPos.x, this.oBody.vCurrentPos.y,
          this.oCurrentNode.oBody.vPosition.x,
          this.oCurrentNode.oBody.vPosition.y ) < iPositionOffset ) {
          // See if there's a key
          this.checkForKey();
          return true;
    } else {
          return false;
    }
  }

  // Flags if we've found a key
  this.checkForKey = function() {
    if ( this.oCurrentNode.bHasKey ) {
      this.bFoundKey = true;
    }
  }

  // Sets a new direction
  this.setDirection = function( cpNewDir ) {
    this.cDirection = cpNewDir;
  }
};

// The body of the path, tracking position 
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
