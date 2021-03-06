(function() {
  window.ArmyData = (function() {
    function ArmyData() {
      this.armies = {};
      this.troops = 0;
    }

    /*
    * The attack power of a player when attacking from a region.
    * @param reg
     */
    ArmyData.prototype.getAttackPower = function(reg) {
      var pow;
      pow = Math.floor(Math.log(this.getArmy(reg) + 2));
      return Math.min(this.getArmy(reg), pow);
    };

    ArmyData.prototype.createArmy = function(region) {
      return this.armies[region.hashCode()] = 0;
    };

    ArmyData.prototype.addTroops = function(region, tCount) {
      var key;
      key = region.hashCode();
      if (!(key in this.armies)) {
        this.armies[key] = 0;
      }
      this.armies[region.hashCode()] += tCount;
      return this.troops += tCount;
    };

    ArmyData.prototype.removeTroops = function(region, tCount) {
      var rCount;
      if (region.hashCode() in this.armies) {
        rCount = Math.min(this.getArmy(region), tCount);
        this.armies[region.hashCode()] -= rCount;
        return this.troops -= rCount;
      }
    };

    ArmyData.prototype.getArmy = function(region) {
      if (region.hashCode() in this.armies) {
        return this.armies[region.hashCode()];
      }
      return 0;
    };

      /**
       *
       * @returns {number|*} The total number of troops.
       */
    ArmyData.prototype.getSize = function() {
      return this.troops;
    };

    return ArmyData;
  })();
}).call(this);
