var oLayout = function( ipNumNodes, avpLocations, bpNeedsKey = false ) {
  this.iNUM_NODES = ipNumNodes;
  this.aoNodes = [];
  this.voEndNodes = new oVector( new oEndNode(), new oEndNode() );
  this.aoRouteNodes = [];

  this.init = function() {
    this.setNodes();
    this.setNodeLocations( avpLocations );
    this.initRouteNodes();
    if ( bpNeedsKey ) {
      this.addKey();
    }
  }

  this.render = function( fpOpacity ) {
    for ( oNode of this.aoNodes ) {
      oNode.render( fpOpacity );
    }
  }

  this.addKey = function() {
    this.aoNodes[ this.iNUM_NODES / 2 ].bHasKey = true;
    this.aoNodes[ this.aoNodes.length - 1 ].bNeedsKey = true;
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
};

var oLevel_0 = function() {
  this.iLevelNum = 0;
  this.bIsFinished = false;
  this.bRequiresKey = false;
  this.iNUM_NODES = 2;
  this.iXIncrement = ( vWindowSize.x / this.iNUM_NODES ) - 200;
  this.iRowStartX = 0;
  this.iRowY = vWindowSize.y / this.iNUM_NODES;
  this.avLocations = [ new oVector( this.iRowStartX + this.iXIncrement, this.iRowY ),
                       new oVector( this.iRowStartX + this.iXIncrement + 400, this.iRowY )
                     ];
  this.oLayout = new oLayout( this.iNUM_NODES, this.avLocations );
};

var oLevel_1 = function() {
  this.iLevelNum = 1;
  this.bIsFinished = false;
  this.bRequiresKey = false;
  this.iNUM_NODES = 3;
  this.iXIncrement = ( vWindowSize.x / this.iNUM_NODES ) - 200;
  this.iRowStartX = 0;
  this.iRowY = vWindowSize.y / this.iNUM_NODES;
  this.avLocations = [ new oVector( this.iRowStartX + this.iXIncrement, this.iRowY ),
                       new oVector( this.iRowStartX + ( this.iXIncrement * 2 ), this.iRowY ),
                       new oVector( this.iRowStartX + ( this.iXIncrement * 3 ), this.iRowY )
                     ];
  this.oLayout = new oLayout( this.iNUM_NODES, this.avLocations );
};

var oLevel_2 = function() {
  this.iLevelNum = 2;
  this.bIsFinished = false;
  this.bRequiresKey = false;
  this.iNUM_NODES = 4;
  this.iXIncrement = ( vWindowSize.x / 3 ) - 200;
  this.iRowStartX = 0;
  this.iRowY_1 = vWindowSize.y / this.iNUM_NODES;
  this.iRowY_2 = vWindowSize.y - this.iRowY_1;
  this.avLocations = [ new oVector( this.iRowStartX + this.iXIncrement, this.iRowY_1 ),
                       new oVector( this.iRowStartX + ( this.iXIncrement * 2 ), this.iRowY_1 ),
                       new oVector( this.iRowStartX + ( this.iXIncrement * 2 ), this.iRowY_2 ),
                       new oVector( this.iRowStartX + ( this.iXIncrement * 3 ), this.iRowY_2 )
                     ];
  this.oLayout = new oLayout( this.iNUM_NODES, this.avLocations );
};

var oLevel_3 = function() {
  this.iLevelNum = 3;
  this.bIsFinished = false;
  this.bRequiresKey = false;
  this.iNUM_NODES = 5;
  this.iXIncrement = ( vWindowSize.x / 3 ) - 200;
  this.iRowStartX = 0;
  this.iRowY_1 = vWindowSize.y / this.iNUM_NODES;
  this.iRowY_2 = vWindowSize.y - this.iRowY_1;
  this.avLocations = [ new oVector( this.iRowStartX + this.iXIncrement, this.iRowY_1 ),
                       new oVector( this.iRowStartX + ( this.iXIncrement * 2 ), this.iRowY_1 ),
                       new oVector( this.iRowStartX + ( this.iXIncrement * 2 ), this.iRowY_2 ),
                       new oVector( this.iRowStartX + ( this.iXIncrement * 3 ), this.iRowY_2 ),
                       new oVector( this.iRowStartX + ( this.iXIncrement * 3 ), this.iRowY_1 )
                     ];
  this.oLayout = new oLayout( this.iNUM_NODES, this.avLocations );
};

var oLevel_4 = function() {
  this.iLevelNum = 4;
  this.bIsFinished = false;
  this.bRequiresKey = true;
  this.iNUM_NODES = 6;
  this.iXIncrement = ( vWindowSize.x / 3 ) - 200;
  this.iRowStartX = 0;
  this.iRowY_1 = vWindowSize.y / 2;
  this.iRowY_2 = vWindowSize.y - ( this.iRowY_1 / 2.5 );
  this.iRowY_0 = 0 + ( this.iRowY_1 / 2.5 );
  this.avLocations = [ new oVector( this.iRowStartX + this.iXIncrement, this.iRowY_1 ),
                       new oVector( this.iRowStartX + ( this.iXIncrement * 2 ), this.iRowY_1 ),
                       new oVector( this.iRowStartX + ( this.iXIncrement * 2 ), this.iRowY_0 ),
                       new oVector( this.iRowStartX + ( this.iXIncrement * 3 ), this.iRowY_0 ),
                       new oVector( this.iRowStartX + ( this.iXIncrement * 3 ), this.iRowY_1 ),
                       new oVector( this.iRowStartX + ( this.iXIncrement * 2 ), this.iRowY_2 )
                     ];
  this.oLayout = new oLayout( this.iNUM_NODES, this.avLocations, true );
};
