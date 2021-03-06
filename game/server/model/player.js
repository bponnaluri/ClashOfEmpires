function MinorPower(){
    this.status=function(){
        return false;
    }

    this.getBuildCount=function(reg,player){
        return 1;
    }


    this.getDefense=function(player,reg){
        return 1.0;
    }
}

function MajorPower(){

    this.status=function(){
        return true;
    }

    this.getBuildCount=function(player,reg){
        var mul=reg.getRecruitment();
        if(reg===player.getCapital()){
            return 20.0*mul;
        }
        return 1.0*mul;
    }

    this.getDefense=function(player,reg){
        if(reg==player.getCapital()){
            return 20;
        }
        return 1;
    }
}

function Player(num,ai,pStatus){

    var myMoney=0;
    var myResearch=0;
    var powStatus=pStatus
    var army=new ArmyData()

    var regions=new HashSet(function(reg){
        return reg.hashCode();
    });

    var score=0;
    var name=""+num;
    var capital=null;

    //Move commands for a player. There can only be one move command per player between regions.
    var moveCommands=new HashSet(function(com){
        return com.hashCode()
    })

    /**
     *
     * @returns {*} boolean indicating if the player is a minor power.
     */
    this.powerStatus=function(){
        return powStatus.status()
    }

    /**
     *
     * @returns {*} Information about a player's power status.
     */
    this.getPowerData=function(){
        return powStatus;
    }

    this.isMinor=function(minor){
        if(minor==true){
            powStatus=new MinorPower();
        }else{
            powStatus=new MajorPower();
        }
    }
    
    /**
     * The attack power of a player when attacking from a region.
     * @param reg
     */
    this.getAttackPower=function(reg){
        var dRes=1.0/powStatus.getDefense(reg.getOwner(),reg);
        return army.getAttackPower(reg)*(1+dRes);
    }

    /**
     * The defense power of a player when defending a region.
     * @param reg
     */
    this.getDefendPower=function(reg){
        var dBonus=powStatus.getDefense(this,reg)*(1);
        return dBonus*Math.min(this.getArmy(reg),2);
    }

    this.exportMoveCommands=function(){
        var data=[]
        moveCommands.forEach(function(command){
            var p1=command.getStart().getLocation();
            var p2=command.getEnd().getLocation();
            var arr={};
            arr["sCity"]=command.getStart().getName()
            arr["eCity"]=command.getEnd().getName()
            arr["x1"]=p1.getX();
            arr["y1"]=p1.getY();
            arr["x2"]=p2.getX();
            arr["y2"]=p2.getY();
            arr["conflict"]=command.hasConflict()
            data.push(arr)
        });
        return data;
    }

    this.addMoveCommand=function(s,e){
        moveCommands.push(new MoveCommand(s,e))
    }

    this.getMoveCommands=function(){
        return moveCommands;
    }

    this.setCapital=function(cap){
        capital=cap;
    }
    this.getCapital=function(){
        return capital;
    }
    this.setName=function(nm){
        name=nm;
    }

    this.addRegion=function(region){
        region.getOwner().removeRegion(region);
        region.setOwner(this);
        regions.push(region)
    }

    this.removeRegion=function(region){
        regions.remove(region);
    }

    this.countRegions=function(){
        return regions.size();
    }

    this.getRegions=function(){
        return regions;
    }

    //TODO: Consider adding a unit test to make sure that this works properly
    this.moveTroops=function(r1,r2,maxSpeed){
        var moveNum=Math.min(this.getArmy(r1),maxSpeed);
        this.removeTroops(r1,moveNum);
        this.addTroops(r2,moveNum);
    }


    this.removeRegion=function(region){
        regions.remove(region)
    }

    this.createArmy=function(region){
        army.createArmy(region)
    }

    this.addTroops=function(region,tCount){
        army.addTroops(region,tCount)
    }

    this.removeTroops=function(region,tCount){
        army.removeTroops(region,tCount)
    }

    this.getArmy=function(region){
        return army.getArmy(region)
    }

    this.buildTroop=function(region){
        var bCount=powStatus.getBuildCount(this,region);
        army.addTroops(region,bCount)
    }



    this.getNum=function(){
        return num;
    }

    this.updateAI=function(){
        moveCommands=ai.run(this);
    }

    this.update=function(){

        var player=this;
        moveCommands.forEach(function(command){
            command.execute(player);
        });

        regions.forEach(function(reg){
            reg.heal();
            myMoney+=reg.getResources();
            myResearch+=reg.getResearch();
        });
        myMoney-=army.getSize()*0.0001;

        //Subtract money for troop costs.
        score+=regions.size();
    }

    /**
     * Remove money in order to pay for somehing.
     * @param cost
     */
    this.subtractCost=function(cost){
        myMoney-=cost/(1+iRes); //Reduce cost by infrastructure.
    }
    this.getMoney=function(){
        return myMoney;
    }

    /**
     * Returns the AI function that the player is using.
     */
    this.getAI=function(){
        return ai;
    }

    this.setAI=function(AiFunc){
        ai=AiFunc;
    }



    this.getScore=function(){
        return score;
    }



    this.setName=function(nm){
        name=nm
    }

    this.getName=function(){
        return name;
    }

    //TODO: Find a way to implement this without creating a new object.
    this.hasMoveCommand=function(r1,r2){
        var c=new MoveCommand(r1,r2);
        return moveCommands.contains(c)
    }

    this.removeMoveCommand=function(r1,r2){
        var c=new MoveCommand(r1,r2)
        moveCommands.remove(c)
    }

    //TODO: These names are also declared in gameManager.js. Refactor so that the names come from one config file.
    var research={};
    research["Movement"]=1;
    research["Infrastructure"]=1;
    research["Farming"]=1;
    research["Defense"]=1;


    /**
     * This function exports data about the player state.
     */
    this.exportState=function(){
        var pData={};
        pData["score"]=this.getScore();
        pData["money"]=Math.round(myMoney);
        pData["num"]=this.getNum();
        pData["research"]=Math.round(myResearch);
        Object.keys(research).forEach(function(resName){
           pData[resName]=research[resName];
        });
        return pData
    }

    this.upgrade=function(uName){

        console.log("Upgrade:"+uName);
        var c=Math.pow(2,research[uName])*10;
        if(c<myMoney){
            research[uName]++;
            this.subtractCost(c);
        }
    }

    this.speedMul=function(){
        return 1+research["Movement"];
    }

    //Pop cap mul
    this.getCapMul=function(){
        return 1+research["Farming"];
    }
}