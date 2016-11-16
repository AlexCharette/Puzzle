
var oNodeBody = function(ipXPos, ipYPos) {
  this.oPosition = new oVector(ipXPos, ipYPos);
  this.iSize = 0;
  this.setPosition = function(ipNewXPos, ipNewYPos) {
    this.oPosition.setPosition(ipNewXPos, ipNewYPos);
  }
};

var oNodeShape = function() {
  this.sColour = "";
  this.setColour = function(spColour) {
    this.sColour = spColour;
  }

  this.render = function() {
    noFill();
    strokeWeight(10);
    stroke(this.sColour);
  }
};

var oEndNode = function(ipXPos = 0, ipYPos = 0) {
  this.oNodeBody = new oNodeBody(ipXPos, ipYPos);
  this.oNodeShape = new oNodeShape();
};

function render() {
  // Have two triangles
  // Change rotation based on state
  // Rotate around center of node
}

var oRouteNode = function(ipXPos = 0, ipYPos = 0, spBaseState = "A") {
  this.oNodeBody = new oNodeBody(ipXPos, ipYPos);
  this.oNodeShape = new oNodeShape();
  this.asStates = ["E", "A", "R", "RD", "D", "DL", "RL", "L", "LU", "U", "RU"];
  this.asUDStates = ["U", "E", "", "A", "D"];
  this.asLRStates = ["L", "E", "", "A", "R"];
  this.sActiveLRState = "E";
  this.sActiveUDState = "E";
  this.sActiveState = this.sActiveUDState + this.sActiveLRState;

  this.receiveCommand = function(spCommand) {
    // Depending on command
    // Change active state
    switch (spCommand) {
      case "up" :

      break;
      case "down" :

      break;
      case "left" :

      break;
      case "right" :

      break;
      default:
      break;
    }
    this.highShift(this.sActiveState);
  }

  this.highShift = function(spState) {
    switch (spState) {
      case "EE" :
      case "E" :

      break;
      case "EA" :
      case "AE" :
      case "AA" :
      case "A" :

      break;
      default:
        this.lowShift(spState);
      break;
    }
  }

  this.lowShift = function(spState) {
    switch (spState) {
      case "UL" :

      break;
      case "UR" :

      break;
      case "DL" :

      break;
      case "DR" :

      break;
      case "UE" :
      case "DE" :

      break;
      case "UA" :
      case "UE" :

      break;
      case "U" :

      break;
      case "D" :

      break;
      case "L" :

      break;
      case "R" :

      break;
      default:

      break;
    }
  }
};
