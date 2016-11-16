var oNode = function(ipXPos, ipYPos) {
  this.sColour = "";
  this.iXPos = ipXPos;
  this.iYpos = ipYPos;
  this.render = function() {
    noFill();
    strokeWeight(10);
    stroke(this.sColour);
  }
};

var oEndNode = function(ipXPos, ipYPos) {
  this.oBaseNode = new oNode(ipXPos, ipYPos);
};

var oRouteNode = function(ipXPos, ipYPos, sBaseState) {
  this.oBaseNode = new oNode(ipXPos, ipYPos);
  this.asStates = ["E", "A", "L", "LU", "LR", "LD", "UR", "UD"
                   "R", "RD", "D"];
  this.sActiveState = sBaseState;
  this.onClick = function() {

  }
};
