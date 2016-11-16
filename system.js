var oSystem = {
  oInputHandler: new oInputHandler(),
  oLayout: new oLayout(),
  aoNodes: [],
  oSelectedNode: undefined,
};

function keyPressed() {
    oSystem.oInputHandler.onKeyPress(key);
}
