var oLayout = function( ipNumNodes, avpLocations ) {
  this.iNUM_NODES2 = ipNumNodes;
  console.log(this.iNUM_NODES2);
  this.aoNodes = [];
  this.voEndNodes = new oVector( new oEndNode(), new oEndNode() );
  this.aoRouteNodes = [];

  this.init = function() {
    this.setNodes();
    this.setNodeLocations( avpLocations );
  }

  this.setNodes = function() {
    this.aoNodes[ 0 ] = this.voEndNodes.x;
    this.aoNodes[ 1 ] = this.voEndNodes.y;
    if ( this.iNUM_NODES2 < 3 ) return;
    this.setRouteNodes( 1 );
    console.log("Node Array: " + this.aoNodes);
  }

  this.setRouteNodes = function( ipStartIndex ) {
    for ( var i = ipStartIndex; i < this.iNUM_NODES2 - 1; i++ )
      this.aoNodes.splice(i, 0, new oRouteNode());
  }

  this.setNodeLocations = function( avpLocations ) {
    for ( var i = 0; i < this.iNUM_NODES2; i++ )
      this.aoNodes[ i ].oNodeBody.setPosition( avpLocations[ i ] );
  }
};

var oLevel_1 = function() {
  this.iNUM_NODES = 3;
  this.iRowStartX = window.InnerWidth / this.iNUM_NODES;
  this.iXIncrement = window.InnerWidth / this.iNUM_NODES * 2;
  this.iRowY = window.InnerHeight / 2;
  this.avLocations = [ new oVector( this.iRowStartX, this.iRowY ),
                 new oVector( this.iRowStartX + this.iXIncrement, this.iRowY ),
                 new oVector( this.iRowStartX + ( this.iXIncrement * 2 ), this.iRowY ) ];
  this.oLayout = new oLayout( this.iNUM_NODES, this.avLocations );
}
