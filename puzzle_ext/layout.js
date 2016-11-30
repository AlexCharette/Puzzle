var oLayout = function( ipNumNodes, avpLocations ) {
  this.iNUM_NODES = ipNumNodes;
  this.aoNodes = [];
  this.voEndNodes = new oVector( new oEndNode(), new oEndNode() );
  this.aoRouteNodes = [];

  this.init = function() {
    this.setNodes();
    this.setNodeLocations( avpLocations );
    this.initRouteNodes();
  }

  this.run = function() {
    this.runNodes();
  }

  this.setNodes = function() {
    this.aoNodes[ 0 ] = this.voEndNodes.x;
    this.aoNodes[ 1 ] = this.voEndNodes.y;
    if ( this.iNUM_NODES2 < 3 ) return;
    this.setRouteNodes( 1 );
  }

  this.setRouteNodes = function( ipStartIndex ) {
    for ( var i = ipStartIndex; i < this.iNUM_NODES - 1; i++ ) {
      this.aoRouteNodes.push( new oRouteNode() );
      this.aoNodes.splice( i, 0, this.aoRouteNodes[ i - 1 ] );
    }
  }

  this.setNodeLocations = function( avpLocations ) {
    for ( var i = 0; i < this.iNUM_NODES; i++ )
      this.aoNodes[ i ].oBody.setPosition( avpLocations[ i ] );
  }

  this.initRouteNodes = function() {
    for ( oRouteNode of this.aoRouteNodes )
      oRouteNode.init();
  }

  this.runNodes = function() {
    for ( oNode of this.aoNodes ) {
      oNode.run();
    }
  }
};

var oLevel_0 = function() {
  this.iLevelNum = 0;
  this.bIsFinished = false;
  this.iNUM_NODES = 2;
  this.iXIncrement = ( vWindowSize.x / this.iNUM_NODES ) - 200;
  this.iRowStartX = 0;
  this.iRowY = vWindowSize.y / 2;
  this.avLocations = [ new oVector( this.iRowStartX + this.iXIncrement, this.iRowY ),
                       new oVector( this.iRowStartX + this.iXIncrement + 400, this.iRowY )
                     ];
  this.oLayout = new oLayout( this.iNUM_NODES, this.avLocations );
};

var oLevel_1 = function() {
  this.iLevelNum = 1;
  this.bIsFinished = false;
  this.iNUM_NODES = 3;
  this.iXIncrement = ( vWindowSize.x / this.iNUM_NODES ) - 200;
  this.iRowStartX = 0;
  this.iRowY = vWindowSize.y / 2;
  this.avLocations = [ new oVector( this.iRowStartX + this.iXIncrement, this.iRowY ),
                       new oVector( this.iRowStartX + ( this.iXIncrement * 2 ), this.iRowY ),
                       new oVector( this.iRowStartX + ( this.iXIncrement * 3 ), this.iRowY )
                     ];
  this.oLayout = new oLayout( this.iNUM_NODES, this.avLocations );
};

var oLevel_2 = function() {
  this.iLevelNum = 2;
  this.bIsFinished = false;
  this.iNUM_NODES = 4;
  this.iXIncrement = ( vWindowSize.x / 3 ) - 200;
  this.iRowStartX = 0;
  this.iRowY_1 = vWindowSize.y / 3;
  this.iRowY_2 = vWindowSize.y - this.iRowY_1;
  this.avLocations = [ new oVector( this.iRowStartX + this.iXIncrement, this.iRowY_1 ),
                       new oVector( this.iRowStartX + ( this.iXIncrement * 2 ), this.iRowY_1 ),
                       new oVector( this.iRowStartX + ( this.iXIncrement * 2 ), this.iRowY_2 ),
                       new oVector( this.iRowStartX + ( this.iXIncrement * 3 ), this.iRowY_2 ),
                     ];
  this.oLayout = new oLayout( this.iNUM_NODES, this.avLocations );
};
