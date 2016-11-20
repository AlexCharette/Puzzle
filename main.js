var oSystem;
var oCommandHandler;
var vWindowSize;
var vMouse;
var sBackgroundColor;

function setup() {
  oSystem = new oSystem();
  oCommandHandler = new oCommandHandler();
  vWindowSize = new oVector( windowWidth, windowHeight );
  vMouse = new oVector();
  sBackgroundColor = 'rgba(46, 74, 140, 0.50)';
  createCanvas( windowWidth, windowHeight );
  background( sBackgroundColor );
  oSystem.init();
}

function draw() {
  background( sBackgroundColor );
  vMouse.set( mouseX, mouseY );
  oSystem.run();
}

function keyPressed() {
  with ( oSystem ) {
    if ( !oSelectedNode ) return;
    oCommandHandler.onKeyPress( key );
    oSelectedNode.receiveCommand( oCommandHandler.sCurrentNodeCommand );
    oSelectedNode.receiveCommand( oCommandHandler.sCurrentSystemCommand );
  }
}

function mouseClicked() {
  oSystem.checkForClickedNode();
}

function windowResized() {
  createCanvas( windowWidth, windowHeight );
}

// TO DO LIST:

// TODO ask Sabine if I can get nodeBodies and store them in an external array
// TODO set different value @ node.js l4
// TODO flesh out animate triangle function @ node.js l55
