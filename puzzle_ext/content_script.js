/*

p5 Easy
CART 351 Chrome Extension
Content script

This is where we actually add our p5 canvas to the browser page when it loads.
An easier way that doesn't use instanced mode, but may therefore lead to weird
conflicts that are hard to diagnose.

*/


// Keep track of whether the sketch should be running or not. At the start, no.
var running = false;

var oSystem;
var oCommandHandler;
var vWindowSize;
var vMouse;
var sBackgroundColor;

var oLevelToRun = undefined;

function setup() {
  setupExtension();
  oCommandHandler = new oCommandHandler();
  vWindowSize = new oVector( windowWidth, windowHeight );
  vMouse = new oVector();
  sBackgroundColor = 'rgba(46, 74, 140, 0.50)';
  oSystem = new oSystem();
  // chrome.runtime.sendMessage({name: "last_level?"}, function (response) {
  //   console.log( response.value )
  //   if ( response.value == -1 ) {
  //       oLevelToRun = new oLevel_0();
  //   } else if ( response.value == 0 ) {
  //       oLevelToRun = new oLevel_1();
  //   } else if ( response.value == 1 ) {
  //       oLevelToRun = new oLevel_2();
  //   } else {
  //       oLevelToRun = new oLevel_0();
  //   }
  // });

  oSystem.setLevel( new oLevel_2() );
  oSystem.init();
}

function setupExtension() {
  // At setup we should see whether or not this script has permission to run
  // in terms of the extension, so we send the message...
  chrome.runtime.sendMessage({name: "isPaused?"}, function (response) {
    // ... and then check the answer...
    if (response.value != 'true') {
      running = true;
      // And then create our canvas to cover the screen
      p5Canvas = createCanvas(windowWidth,windowHeight);
      // And set its CSS properties to be fixed (e.g. it scrolls), positioned
      // at the top left, with a high z-index to float over everything else, and
      // not to receive pointer events so we can still interact with the page below
      p5Canvas.elt.style.position = 'fixed';
      p5Canvas.elt.style.top = 0;
      p5Canvas.elt.style.left = 0;
      p5Canvas.elt.style["z-index"] = 1000;
      p5Canvas.elt.style["pointer-events"] = 'none';
      // Note that, for reasons I do not understand, all mouse events still work fine
      // in the p5 canvas...???

      // Get rid of the cursor
      $('*').css({'cursor': 'none'});
    }
    else {
      // If we are paused, don't bother with draw
      noLoop();
    }
  });
}

function draw() {
  // First of all, if the extension is paused, don't do anything
  if (!running) return;
  // From here on it's just whatever standard p5 stuff you want to do.
  background(sBackgroundColor);
  vMouse.set( mouseX, mouseY );

  if ( oSystem.bIsLevelFinished ) {
    chrome.runtime.sendMessage({name: "levelComplete", value: oSystem.oCurrentLevel.iLevelNum }, function(response) {
      clear();
      running = false;
    });
  } else {
    oSystem.run();
  }
}

function keyPressed() {
  with ( oSystem ) {
    oCommandHandler.onKeyPress( key );
    oPath.receiveCommand( oCommandHandler.sCurrentSystemCommand );
    console.log( oCommandHandler.sCurrentSystemCommand )
    if ( !oSelectedNode ) return;
    if ( oCommandHandler.sCurrentSystemCommand == "run" ) {
      oSelectedNode = undefined;
    } else {
      oSelectedNode.receiveCommand( oCommandHandler.sCurrentNodeCommand );
    }
  }
}

function mouseClicked() {
  oSystem.checkForClickedNode();
  console.log("They clicked!");
}

function windowResized() {
  createCanvas( windowWidth, windowHeight );
}
