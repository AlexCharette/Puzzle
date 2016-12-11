var oCommandHandler = function() {
  this.asNodeCommands = [ "up", "down", "left", "right" ];
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
