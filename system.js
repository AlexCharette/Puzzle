var oSystem = {
  oPath: new oPath(),
  oLevel_1: new oLevel_1,

  init: function() {
    this.loadLevel( this.oLevel_1 );
    console.log(this.aoNodes);
  },

  run: function() {
    this.checkPathProgress();
  },

  loadLevel: function( opLevel ) {
    this.oCurrentLevel = opLevel;
    opLevel.oLayout.init();
    this.aoNodes = opLevel.oLayout.aoNodes;
    this.oPath.oBody.setStartPos( this.aoNodes[ 0 ].oBody.vPosition );
  },

  checkPathProgress: function() {
    with ( this.oPath.oBody ) {
      for ( oNode of this.oCurrentLevel.oLayout.aoRouteNodes ) {
        if ( oNode.oBody.bContains( this.vCurrentPos ) ) {
          this.oCurrentNode = oNode;
        }
      }
    }
  }
}
