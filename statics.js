/*
  Contains the vector class. Useful for 2 element structs.
  Didn't need to be in its own tab.
*/
var oVector = function( pX = 0, pY = 0 ) {
  this.x = pX;
  this.y = pY;
  // Sets new values 
  this.set = function( pNewX, pNewY ) {
    this.x = pNewX;
    this.y = pNewY;
  }
};
