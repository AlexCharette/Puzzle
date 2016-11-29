var oSystem = function() {
  this.oPath = new oPath();
  this.oSelectedNode = undefined;

  this.init = function() {
    this.loadLevel( new oLevel_0() );
    this.loadPath();
    this.checkPathProgress();
  }

  this.run = function() {
    this.oCurrentLevel.oLayout.run();
    if ( this.oPath.bIsRunning ) {
      this.checkPathProgress();
    }
    this.oPath.run();
  }

  this.loadPath = function() {
    var vFirstNodePos = this.aoNodes[ 0 ].oBody.vPosition;
    this.oPath.oBody.setStartPos( new oVector( vFirstNodePos.x, vFirstNodePos.y ) );
    this.oPath.init();
  }

  this.loadLevel = function( opLevel ) {
    this.oCurrentLevel = opLevel;
    opLevel.oLayout.init();
    this.aoNodes = opLevel.oLayout.aoNodes;
  }

  this.checkForClickedNode = function() {
    for ( oNode of this.aoNodes ) {
      if ( oNode.oBody.bContains( vMouse ) ) {
        this.setSelectedNode( oNode );
      }
    }
  }

  this.setSelectedNode = function( opNode ) {
    // If a new node has been selected...
    if ( this.oSelectedNode ) {
      this.oSelectedNode.bIsSelected = false;
    }
    this.oSelectedNode = opNode;
    this.oSelectedNode.bIsSelected = true;
  }

  this.checkPathProgress = function() {
    if ( !this.oPath.oBody.vCurrentPos ) return;
    for ( oNode of this.aoNodes ) {
      if ( oNode.oBody.bContains( this.oPath.oBody.vCurrentPos ) ) {
        this.oPath.oCurrentNode = oNode;
        if ( this.aoNodes.indexOf( oNode ) == 0 ) {
          this.oPath.oCurrentNode.bIsFirst = true;
        } else if ( this.aoNodes.indexOf( oNode ) == this.aoNodes.length - 1 ) {
          this.oPath.oCurrentNode.bIsLast = true;
          this.oCurrentLevel.bIsFinished = true;
        }
      }
    }
  }
};
