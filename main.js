
var sBackgroundColor = "#2E4A8C";

function setup() {
  createCanvas( windowWidth, windowHeight );
  oSystem.init();
  oLevel_1.logtoconsole();
}

function draw() {
  oSystem.run();
}

function keyPressed() {
  oInputHandler.onKeyPress( key );
  oSelectedNode.receiveCommand( oInputHandler.sCurrentNodeCommand );
  oSelectedNode.receiveCommand( oInputHandler.sCurrentSystemCommand );
}

function windowResized() {
  createCanvas( windowWidth, windowHeight );
}

// TO DO LIST:

// TODO set different value @ node.js l4
// TODO flesh out animate triangle function @ node.js l55
