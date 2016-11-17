var oSystem = {
  oInputHandler: new oInputHandler(),
  oLayout: new oLayout(),
  aoNodes: [],
  oSelectedNode: undefined,
};

function keyPressed() {
  with ( oSystem ) {
    oInputHandler.onKeyPress( key );
    oSelectedNode.receiveCommand( oInputHandler.sCurrentCommand );
  }
}

function eGetNextIn( apArray, pCurrentElement ) {
  if ( ( indexOf( apArray ) + 1 ) < apArray.length ) {
    pCurrentElement = apArray[ indexOf( pCurrentElement ) + 1 ];
  }
  return pCurrentElement;
}

function eGetPreviousIn( apArray, pCurrentElement ) {
  if ( ( indexOf( apArray ) - 1 ) >= 0 ) {
    pCurrentElement = apArray[ indexOf( pCurrentElement ) - 1 ];
  }
  return pCurrentElement;
}
