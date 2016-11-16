var oLevel = function(ipNumNodes) {
  this.iNUM_NODES = ipNumNodes;
  this.aoNodes = [];

  this.setNodes = function() {
    this.aoNodes[0] = new oEndNode();
    this.aoNodes[iNUM_NODES - 1] = new oEndNode();
    if (iNUM_NODES < 3) return;
    for (var i = 1; i < iNUM_NODES - 1; i++) {
      this.aoNodes[i] = new oRouteNode();
    }
  }
  this.setNodeLocations = function(aopLocations) {
    for (var i = 0; i < iNUM_NODES; i++) {
      this.aoNodes[i].setLocation(aopLocations[i]);
    }
  }
};

var oLevelOne = function() {
  this.iNUM_NODES = 3;
  this.iRowStartX = width / iNUM_NODES;
  this.iXIncrement = width / iNUM_NODES * 2;
  this.iRowY = height / 2;
  this.aoLocations = [new oVector(this.iRowStartX, this.iRowY),
                      new oVector(this.iRowStartX + this.iXIncrement, this.iRowY),
                      new oVector(this.iRowStartX + (this.iXIncrement * 2), this.iRowY)];
  this.oLevel = new oLevel(this.iNUM_NODES);
};

var oVector = function(ipXPos, ipYPos) {
  this.iXPos = ipXPos;
  this.iYPos = ipYPos;
  this.setPosition = function(ipNewXPos, ipNewYPos) {
    this.iXPos = ipNewXPos;
    this.iYPos = ipNewYPos;
  }
};
