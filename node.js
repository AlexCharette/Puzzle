var oSelectedNode = undefined;

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

var oEndNode = function(ipXPos, ipYPos, bpIsLocked) {
  this.oBaseNode = new oNode(ipXPos, ipYPos);
  this.bIsLocked = bpIsLocked;
};

var oRouteNode = function(ipXPos, ipYPos, spBaseState) {
  this.oBaseNode = new oNode(ipXPos, ipYPos);
  this.asStates = ["R", "RD", "D", "RL", "L", "LU", "U", "E"
                   "A", "RU", "D"];
  this.sActiveState = sBaseState;
  this.onClick = function() {
    oSelectedNode = this;
  }

  this.highShift = function(spState) {
    switch (spState) {
      case "E" :

      break;
      case "A" :

      break;
      default:
        this.lowShift(spState);
      break;
    }
  }

  this.lowShift = function(spState) {
    switch (spState) {
      case "L" :

      break;
      case "LU" :

      break;
      case "LR" :

      break;
      default:

      break;
    }
  }
};

// Control scheme:
/*
  Cycle States: UP-DOWN =
  Key(D) : >> (clockwise) | Key(A) : << (counter-clockwise)
*/
