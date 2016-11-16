var oInputHandler = function() {
  this.sCurrentCommand = "";
  this.onKeyPress = function(ipKey) {
    var asCommands = ["up", "down", "left", "right", "invalid"];
    if (ipKey == 'w') {
      this.sCurrentCommand = asCommands[0];
    } else if (ipKey == 's') {
      this.sCurrentCommand = asCommands[1];
    } else if (ipKey == 'a') {
      this.sCurrentCommand = asCommands[2];
    } else if (ipKey == 'd') {
      this.sCurrentCommand = asCommands[3];
    } else {
      this.sCurrentCommand = asCommands[4];
    }
  }
};
