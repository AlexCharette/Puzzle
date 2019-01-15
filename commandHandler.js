/*
  Contains the command handler class that serves as the interface
  between the user and the nodes. Useless? Maybe.
*/
var oCommandHandler = function() {
  // The different commands that can be given
  this.asNodeCommands = [ "up", "down", "left", "right" ];
  // Changes the current command when a key (W, A, S, D) is pressed
  this.onKeyPress = function( ipKey ) {
    switch ( ipKey ) {
      case 'W' :
        this.sCurrentNodeCommand = this.asNodeCommands[ 0 ];
      break;
      case 'S' :
        this.sCurrentNodeCommand = this.asNodeCommands[ 1 ];
      break;
      case 'A' :
        this.sCurrentNodeCommand = this.asNodeCommands[ 2 ];
      break;
      case 'D' :
        this.sCurrentNodeCommand = this.asNodeCommands[ 3 ];
      break;
      default :
      break;
    }
  }
};
