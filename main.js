var vWindowSize;
var vMouse;
var sBackgroundColor;
var oSystem;

function setup() {
  oSystem = new oSystem();
  vWindowSize = new oVector( windowWidth, windowHeight );
  vMouse = new oVector( mouseX, mouseY );
  sBackgroundColor = 'rgba(46, 74, 140, 0.50)';
  createCanvas( windowWidth, windowHeight );
  background( sBackgroundColor );
  oSystem.init();
}

function draw() {
  background( sBackgroundColor );

  oSystem.run();
}

function keyPressed() {
  with ( oSystem ) {
    if ( !oSelectedNode ) return;
    oInputHandler.onKeyPress( key );
    oSelectedNode.receiveCommand( oInputHandler.sCurrentNodeCommand );
    oSelectedNode.receiveCommand( oInputHandler.sCurrentSystemCommand );
  }
}

function windowResized() {
  createCanvas( windowWidth, windowHeight );
}

// TO DO LIST:

// TODO ask Sabine if I can get nodeBodies and store them in an external array
// TODO set different value @ node.js l4
// TODO flesh out animate triangle function @ node.js l55
