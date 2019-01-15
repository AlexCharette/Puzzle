/*
  The main system which contains path and nodes objects
*/
var oSystem = function() {
  this.oPath = new oPath();
  // No node has been selected
  this.oSelectedNode = undefined;
  // The overall opacity
  this.fOpacity = 0.8;
  // The level hasn't been finished
  this.bLevelIsFinished = false;

  // Initializes the puzzle
  this.init = function() {
    // Loads a level and its attributes
    this.loadLevel( this.oCurrentLevel );
    // Starts up the path
    this.loadPath();
    // Keeps track of the progress of the path
    this.checkPathProgress();
  }

  // Executes looping methods
  this.run = function() {
    // Keep track of the progress if we're running
    if ( this.oPath.bIsRunning ) {
      this.checkPathProgress();
    }
    // Run the path object
    this.oPath.run();
    // If the path isn't running, flag all nodes as not being crossed
    if ( !this.oPath.bIsRunning ) {
      for ( oNode of this.aoNodes ) {
        oNode.bWasCrossed = false;
      }
    }
  }

  // Renders all objects including path and nodes
  this.render = function() {
    // Render the nodes
    this.oCurrentLevel.oLayout.render( this.fOpacity );
    // Render the path
    this.oPath.render( this.fOpacity );
    // Render a custom cursor
    this.renderCursor( this.fOpacity );
  }

  // Sets an initial location for the path and initializes it
  this.loadPath = function() {
    var vFirstNodePos = this.aoNodes[ 0 ].oBody.vPosition;
    this.oPath.oBody.setStartPos( new oVector( vFirstNodePos.x, vFirstNodePos.y ) );
    this.oPath.init();
  }

  // Sets a new level
  this.setLevel = function( opLevel ) {
    this.oCurrentLevel = opLevel;
  }

  // Loads the properties of that level and creates an array of nodes from it
  this.loadLevel = function( opLevel ) {
    opLevel.oLayout.init();
    this.aoNodes = opLevel.oLayout.aoNodes;
  }

  // Finds if the mouse was hovering over a node when it was clicked
  this.checkForClickedNode = function() {
    for ( oNode of this.aoNodes ) {
      if ( oNode.oBody.bContains( vMouse ) ) {
        this.setSelectedNode( oNode );
      }
    }
  }

  // Marks a node as being selected for interaction
  this.setSelectedNode = function( opNode ) {
    // If a new node has been selected,
    if ( this.oSelectedNode ) {
      // Set the last one as no longer selected
      this.oSelectedNode.bIsSelected = false;
    }
    // Set the newly selected one
    this.oSelectedNode = opNode;
    this.oSelectedNode.bIsSelected = true;
  }

  // Tracks the progress of the path
  this.checkPathProgress = function() {
    if ( !this.oPath.oBody.vCurrentPos ) return;
    // Go through every node to see if the path is in it
    for ( oNode of this.aoNodes ) {
      if ( oNode.oBody.bContains( this.oPath.oBody.vCurrentPos ) ) {
        // If it is, set that node as being the current one
        this.oPath.oCurrentNode = oNode;
        // If the current node is the first one,
        if ( this.aoNodes.indexOf( oNode ) == 0 ) {
          // Flag it as being so, because we don't want to interact with it
          this.oPath.oCurrentNode.bIsFirst = true;
          // If the node is the last one,
        } else if ( this.aoNodes.indexOf( oNode ) == this.aoNodes.length - 1 ) {
          // Flag it because we need to signal the end
          this.oPath.oCurrentNode.bIsLast = true;
          // If there is a key that hasn't been found,
          if ( this.oCurrentLevel.bRequiresKey
               && !this.oPath.bFoundKey ) {
            // The level is not finished and the user has made a mistake
            this.bLevelIsFinished = false;
            this.oPath.bUserMadeMistake = true;
            // So we reset the path
            this.oPath.reset();
            // If a key has been found or none is needed,
          } else {
            // The puzzle has been solved
            this.oPath.bPuzzleSolved = true;
            // Give the user a minute to see everything
            with ( this ) {
              setTimeout(function() {
                bLevelIsFinished = true;
              }, 750);
            }
          }
        }
      }
    }
  }

  // Renders a custom cursor
  // Two ellipses, the larger outer one being slightly paler
  this.renderCursor = function() {
    var fCursorSize = 20;
    noStroke();
    fill( 'rgba(67, 120, 181,' + this.fOpacity + ')' );
    smooth();
    ellipse(vMouse.x, vMouse.y, fCursorSize, fCursorSize);
    fill('rgba(67, 120, 181,' + ( this.fOpacity / 3 ) + ')');
    ellipse(vMouse.x, vMouse.y, fCursorSize * 1.5, fCursorSize * 1.5);
  }
};
