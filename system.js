var oSystem = function() {
  this.oPath = new oPath();

  this.init = function() {
    this.loadLevel( new oLevel_1() );
  }

  this.run = function() {
    //this.checkPathProgress();
    this.oCurrentLevel.oLayout.runNodes();
  }

  this.loadLevel = function( opLevel ) {
    this.oCurrentLevel = opLevel;
    opLevel.oLayout.init();
    this.aoNodes = opLevel.oLayout.aoNodes;
    this.oPath.oBody.setStartPos( this.aoNodes[ 0 ].oBody.vPosition );
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
