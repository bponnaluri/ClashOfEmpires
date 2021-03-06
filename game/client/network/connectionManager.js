
/*
 * This file is used to manage connections with the client.
 * @constructor
 */

function LocalConnectionManager() {
  this.game=new GameManager(new RandomHex(5));

}


/*
 * Gets information about the map.
 */
LocalConnectionManager.prototype.exportGameInfo = function() {
  return this.game.exportGameInfo();
};


/*
 * Gets information about each player.
 */
LocalConnectionManager.prototype.getPlayerState = function() {
  return this.game.getPlayerState();
};


/*
 * Gets information about each region.
 */
LocalConnectionManager.prototype.getRegionStates = function() {
  return this.game.updateState();
};




  /**
   * Gets the name of the region that was clicked on.
   * @returns {*}
   */
LocalConnectionManager.prototype.getSavedClick = function() {
  return this.game.getFirstClickName();
};


/*
 * Sends information about the click to the server.
 * @param data Information about the click.
 * @param pName The player that made the click.
 */
LocalConnectionManager.prototype.sendClick = function(data, pName) {
  return this.game.processClick(data, pName);
};


/*
 * Adds information about a client player to the server.
 * @param pName The player that is being added.
 */
LocalConnectionManager.prototype.registerPlayerClicks = function(pName) {
  return this.game.registerPlayerClicks(pName);
};

LocalConnectionManager.prototype.upgradeCommand=function(upCom){
    this.game.upgradeCommand(upCom);
}

LocalConnectionManager.prototype.researchCommand=function(rName){
    this.game.researchCommand(rName);
}


