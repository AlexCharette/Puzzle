var oInputHandler = {
  sCurrentNodeCommand: "",
  sCurrentSystemCommand: "pause",
  onKeyPress: function(ipKey) {
    var asCommands = ["up", "down", "left", "right", "run", "pause", "invalid"];
    switch (ipKey) {
      case 'w' :
        this.sCurrentNodeCommand = asCommands[0];
      break;
      case 's' :
        this.sCurrentNodeCommand = asCommands[1];
      break;
      case 'a' :
        this.sCurrentNodeCommand = asCommands[2];
      break;
      case 'd' :
        this.sCurrentNodeCommand = asCommands[3];
      break;
      case 'space' :
        if ( this.sCurrentSystemCommand != asCommands[4] ) {
          this.sCurrentSystemCommand = asCommands[4];
        } else {
          this.sCurrentSystemCommand = asCommands[5];
        }
      break;
      default :
        this.sCurrentCommand = asCommands[asCommands.length - 1]; // invalid
      break;
    }
  }
}
