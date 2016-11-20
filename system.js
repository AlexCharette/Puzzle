var oSystem = function() {
  this.oPath = new oPath();

  this.init = function() {
    this.loadLevel( new oLevel_1() );
  }

  this.run = function() {
    this.checkPathProgress();
    this.oCurrentLevel.oLayout.runNodes();
  }

  this.loadLevel = function( opLevel ) {
    this.oCurrentLevel = opLevel;
    opLevel.oLayout.init();
    this.aoNodes = opLevel.oLayout.aoNodes;
    this.oPath.oBody.setStartPos( this.aoNodes[ 0 ].oBody.vPosition );
  }

  this.checkForClickedNode = function() {
    for ( oNode of this.aoNodes ) {
      if ( oNode.oBody.bContains( vMouse ) )
        this.setSelectedNode( oNode );
    }
  }

  this.setSelectedNode = function( opNode ) {
    if ( this.oSelectedNode ) {
      this.oSelectedNode.bIsSelected = false;
    }
    this.oSelectedNode = opNode;
    this.oSelectedNode.bIsSelected = true;
    console.log(this.oSelectedNode)
  }

  this.checkPathProgress = function() {
    with ( this.oPath.oBody ) {
      for ( oNode of this.oCurrentLevel.oLayout.aoRouteNodes ) {
        if ( oNode.oBody.bContains( this.vCurrentPos ) ) {
          this.oCurrentNode = oNode;
        }
      }
    }
  }
};
