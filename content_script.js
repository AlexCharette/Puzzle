/*

Locked
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
  // Instantiate required objects
  oCommandHandler = new oCommandHandler();
  // Store the window size so that we can access it outside of p5 functions
  vWindowSize = new oVector( windowWidth, windowHeight );
  vMouse = new oVector();
  oSystem = new oSystem();
  // Check to see what level we should start at
  chrome.runtime.sendMessage({name: "last_level?"}, function (response) {
    // Start at the next level from the one last finished
    if ( response.value == -1 ) {
        oLevelToRun = new oLevel_0();
    } else if ( response.value == 0 ) {
        oLevelToRun = new oLevel_1();
    } else if ( response.value == 1 ) {
        oLevelToRun = new oLevel_2();
    } else if ( response.value == 2 ) {
        oLevelToRun = new oLevel_3();
    } else if ( response.value == 3 ) {
        oLevelToRun = new oLevel_4();
    } else {
        oLevelToRun = new oLevel_0();
    }
    // Set the level and start things up
    oSystem.setLevel( oLevelToRun );
    oSystem.init();
  });
}

// Sets up the required framework to run a p5 overlay
function setupExtension() {
  // At setup we should see whether or not this script has permission to run
  // in terms of the extension, so we send the message...
  chrome.runtime.sendMessage({name: "isPaused?"}, function (response) {
    // ... and then check the answer...
    if (response.value != 'true') {
      running = true;
      // And then create our canvas to cover the screen
      p5Canvas = createCanvas(windowWidth, windowHeight);
      // And set its CSS properties to be fixed (e.g. it scrolls), positioned
      // at the top left, with a high z-index to float over everything else, and
      // not to receive pointer events so we can still interact with the page below
      p5Canvas.elt.style.position = 'fixed';
      p5Canvas.elt.style.top = 0;
      p5Canvas.elt.style.left = 0;
      p5Canvas.elt.style["z-index"] = 1000;
      p5Canvas.elt.style["pointer-events"] = 'none';
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

  background(255);
  // Store the mouse position so that we can access it from non-p5 functions
  vMouse.set( mouseX, mouseY );

  // Once the level has been completed,
  if ( oSystem.bLevelIsFinished ) {
    // Store it
    chrome.runtime.sendMessage({name: "levelComplete", value: oSystem.oCurrentLevel.iLevelNum }, function(response) {
      // Wipe the canvas
      clear();
      // Reallow clicking
      $('*').css({'cursor': 'auto'});
      // $('a').click(function() {
      //   $(this).addClass("active");
      // });
      // Set running to false
      running = false;
    });
  } else {
    // Prevent the user from clicking on links
    $('a').click(function() {
      return false;
    });
    // Hide all cursor action
    $('*').css({'cursor': 'none'});
    oSystem.run();
    oSystem.render();
  }
}

function keyPressed() {
  with ( oSystem ) {
    // Send the key to the command handler
    oCommandHandler.onKeyPress( key );
    // Switch the pause / running state if the spacebar is pressed
    if ( keyCode == 32 ) {
      oPath.switchState();
    } else {
      if ( !oSelectedNode ) return;
      if ( oPath.bIsRunning ) {
        oSelectedNode = undefined;
      } else {
        // If the path isn't running, allow the selected node to receive commands
        oSelectedNode.receiveCommand( oCommandHandler.sCurrentNodeCommand );
      }
    }
  }
}

function mouseClicked() {
  // Check to see if a node was clicked
  oSystem.checkForClickedNode();
}

function windowResized() {
  createCanvas( windowWidth, windowHeight );
}
