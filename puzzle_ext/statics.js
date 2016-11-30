
function eGetNextIn_From( pArray, pCurrentElement ) {
  if ( ( pArray.indexOf( pCurrentElement ) + 1 ) < pArray.length ) {
    pCurrentElement = pArray[ pArray.indexOf( pCurrentElement ) + 1 ];
  }
  return pCurrentElement;
}

function eGetPreviousIn_From( pArray, pCurrentElement ) {
  if ( ( pArray.indexOf( pCurrentElement ) - 1 ) >= 0 ) {
    pCurrentElement = pArray[ pArray.indexOf( pCurrentElement ) - 1 ];
  }
  return pCurrentElement;
}

var oVector = function( pX = 0, pY = 0 ) {
  this.x = pX;
  this.y = pY;
  this.set = function( pNewX, pNewY ) {
    this.x = pNewX;
    this.y = pNewY;
  }
};