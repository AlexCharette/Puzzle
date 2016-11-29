var oCommandHandler = function() {
  this.sCurrentSystemCommand = "pause";
  this.asNodeCommands = [ "up", "down", "left", "right" ];
  this.asSystemCommands = [ "run", "pause" ];
  this.sError = "invalid";
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
      case ' ' :
        if ( this.sCurrentSystemCommand != this.asSystemCommands[ 0 ] ) {
          this.sCurrentSystemCommand = this.asSystemCommands[ 0 ];
        } else {
          this.sCurrentSystemCommand = this.asSystemCommands[ 1 ];
        }
      break;
      default :
        this.sCurrentNodeCommand = this.sError;
      break;
    }
  }
};
