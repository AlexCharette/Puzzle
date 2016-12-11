var oSystem = function() {
  this.oPath = new oPath();
  this.oSelectedNode = undefined;
  this.fOpacity = 1.0;
  this.bLevelIsFinished = false;

  this.init = function() {
    this.loadLevel( this.oCurrentLevel );
    this.loadPath();
    this.checkPathProgress();
  }

  this.run = function() {
    if ( this.oPath.bIsRunning ) {
      this.checkPathProgress();
    }
    this.oPath.run();
    if ( !this.oPath.bIsRunning ) {
      for ( oNode of this.aoNodes ) {
        oNode.bWasCrossed = false;
      }
    }
  }

  this.render = function() {
    if ( this.bLevelIsFinished ) {
      this.fadeRender();
    }
    this.oCurrentLevel.oLayout.render( this.fOpacity );
    this.oPath.render( this.fOpacity );
    this.renderCursor( this.fOpacity );
  }

  this.loadPath = function() {
    var vFirstNodePos = this.aoNodes[ 0 ].oBody.vPosition;
    this.oPath.oBody.setStartPos( new oVector( vFirstNodePos.x, vFirstNodePos.y ) );
    this.oPath.init();
  }

  this.setLevel = function( opLevel ) {
    this.oCurrentLevel = opLevel;
  }

  this.loadLevel = function( opLevel ) {
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
          if ( this.oCurrentLevel.bRequiresKey
               && !this.oPath.bFoundKey ) {
            this.bLevelIsFinished = false;
            this.oPath.bUserMadeMistake = true;
            this.oPath.reset();
          } else {
            this.bLevelIsFinished = true;
          }
        }
      }
    }
  }

  this.fadeRender = function() {
    while ( this.fOpacity >= 0 ) {
      this.fOpacity -= 0.01;
    }
  }

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
