/*
  Contains all distinct level object and the underlying layout code
*/
// The layout is what arranged all the nodes
var oLayout = function( ipNumNodes, avpLocations, bpNeedsKey = false ) {
  this.iNUM_NODES = ipNumNodes;
  this.aoNodes = [];
  // Only need two end ends
  this.voEndNodes = new oVector( new oEndNode(), new oEndNode() );
  this.aoRouteNodes = [];

  // Initializes the layout
  this.init = function() {
    this.setNodes();
    this.setNodeLocations( avpLocations );
    this.initRouteNodes();
    if ( bpNeedsKey ) {
      this.addKey();
    }
  }

  // Renders all the nodes
  this.render = function( fpOpacity ) {
    for ( oNode of this.aoNodes ) {
      oNode.render( fpOpacity );
    }
  }

  // Adds the key and the "lock" to the mix
  this.addKey = function() {
    this.aoNodes[ this.iNUM_NODES / 2 ].bHasKey = true;
    this.aoNodes[ this.aoNodes.length - 1 ].bNeedsKey = true;
  }

  // Adds end nodes to the end of the array of nodes, as well as
  // route nodes if necessary
  this.setNodes = function() {
    this.aoNodes[ 0 ] = this.voEndNodes.x;
    this.aoNodes[ 1 ] = this.voEndNodes.y;
    if ( this.iNUM_NODES2 < 3 ) return;
    this.setRouteNodes( 1 );
  }

  // Creates route nodes between the end nodes
  this.setRouteNodes = function( ipStartIndex ) {
    for ( var i = ipStartIndex; i < this.iNUM_NODES - 1; i++ ) {
      this.aoRouteNodes.push( new oRouteNode() );
      this.aoNodes.splice( i, 0, this.aoRouteNodes[ i - 1 ] );
    }
  }

  // Assigns locations to all nodes
  this.setNodeLocations = function( avpLocations ) {
    for ( var i = 0; i < this.iNUM_NODES; i++ )
      this.aoNodes[ i ].oBody.setPosition( avpLocations[ i ] );
  }

  // Initializes all of the route nodes
  this.initRouteNodes = function() {
    for ( oRouteNode of this.aoRouteNodes )
      oRouteNode.init();
  }
};

// The first level, two squares
var oLevel_0 = function() {
  this.iLevelNum = 0;
  this.bIsFinished = false;
  this.bRequiresKey = false;
  this.iNUM_NODES = this.iLevelNum + 2;
  this.iXIncrement = vWindowSize.x / ( this.iNUM_NODES * 2 );
  this.iScreenCenter = vWindowSize.x / 2;
  this.iRowY = vWindowSize.y / 2;
  this.avLocations = [ new oVector( this.iScreenCenter - this.iXIncrement, this.iRowY ),
                       new oVector( this.iScreenCenter + this.iXIncrement, this.iRowY )
                     ];
  // Create a new layout and give it a number of nodes and their locations
  this.oLayout = new oLayout( this.iNUM_NODES, this.avLocations );
};

// Introduce route nodes to the mix
var oLevel_1 = function() {
  this.iLevelNum = 1;
  this.bIsFinished = false;
  this.bRequiresKey = false;
  this.iNUM_NODES = this.iLevelNum + 2;
  this.iXIncrement = vWindowSize.x / this.iNUM_NODES;
  this.iScreenCenter = vWindowSize.x / 2;
  this.iRowY = vWindowSize.y / 2;
  this.avLocations = [ new oVector( this.iScreenCenter - this.iXIncrement, this.iRowY ),
                       new oVector( this.iScreenCenter, this.iRowY ),
                       new oVector( this.iScreenCenter + this.iXIncrement, this.iRowY )
                     ];
  this.oLayout = new oLayout( this.iNUM_NODES, this.avLocations );
};

// More route nodes!
var oLevel_2 = function() {
  this.iLevelNum = 2;
  this.bIsFinished = false;
  this.bRequiresKey = false;
  this.iNUM_NODES = this.iLevelNum + 2;
  this.iXIncrement = vWindowSize.x / 3;
  this.iScreenCenter = vWindowSize.x / 2;
  this.iRowY_1 = vWindowSize.y / this.iNUM_NODES;
  this.iRowY_2 = vWindowSize.y - this.iRowY_1;
  this.avLocations = [ new oVector( this.iScreenCenter - this.iXIncrement, this.iRowY_1 ),
                       new oVector( this.iScreenCenter, this.iRowY_1 ),
                       new oVector( this.iScreenCenter, this.iRowY_2 ),
                       new oVector( this.iScreenCenter + this.iXIncrement, this.iRowY_2 )
                     ];
  this.oLayout = new oLayout( this.iNUM_NODES, this.avLocations );
};

// Moooooore
var oLevel_3 = function() {
  this.iLevelNum = 3;
  this.bIsFinished = false;
  this.bRequiresKey = false;
  this.iNUM_NODES = this.iLevelNum + 2;
  this.iXIncrement = ( vWindowSize.x / 3 ) - 200;
  this.iScreenCenter = vWindowSize.x / 2;
  this.iRowY_1 = vWindowSize.y / this.iNUM_NODES;
  this.iRowY_2 = vWindowSize.y - this.iRowY_1;
  this.avLocations = [ new oVector( this.iScreenCenter - this.iXIncrement, this.iRowY_1 ),
                       new oVector( this.iScreenCenter, this.iRowY_1 ),
                       new oVector( this.iScreenCenter, this.iRowY_2 ),
                       new oVector( this.iScreenCenter + this.iXIncrement, this.iRowY_2 ),
                       new oVector( this.iScreenCenter + this.iXIncrement, this.iRowY_1 )
                     ];
  this.oLayout = new oLayout( this.iNUM_NODES, this.avLocations );
};

// This level needs a key
var oLevel_4 = function() {
  this.iLevelNum = 4;
  this.bIsFinished = false;
  this.bRequiresKey = true;
  this.iNUM_NODES = this.iLevelNum + 2;
  this.iXIncrement = vWindowSize.x / this.iNUM_NODES;
  this.iScreenCenter = vWindowSize.x / 2;
  this.iRowY_1 = vWindowSize.y / 2;
  this.iRowY_2 = vWindowSize.y - ( this.iRowY_1 / 2.5 );
  this.iRowY_0 = 0 + ( this.iRowY_1 / 2.5 );
  this.avLocations = [ new oVector( this.iScreenCenter - this.iXIncrement, this.iRowY_1 ),
                       new oVector( this.iScreenCenter, this.iRowY_1 ),
                       new oVector( this.iScreenCenter, this.iRowY_0 ),
                       new oVector( this.iScreenCenter + this.iXIncrement, this.iRowY_0 ),
                       new oVector( this.iScreenCenter + this.iXIncrement, this.iRowY_1 ),
                       new oVector( this.iScreenCenter, this.iRowY_2 )
                     ];
  // So we indicate that!
  this.oLayout = new oLayout( this.iNUM_NODES, this.avLocations, true );
};
