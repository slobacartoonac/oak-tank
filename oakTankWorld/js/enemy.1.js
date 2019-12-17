function Enemy(team)
{
    this.team=team;
    this.shield=1;
}
Enemy.prototype.update=function(vehicle,physics)
{
    physics.teamMembers[this.team]+=1;
    if(vehicle.model.position.x==vehicle.dest.x&&vehicle.model.position.z==vehicle.dest.z)
    {
        var dist=-1;
        var ii=-1;
        var dx=0;
        var dy=0;
        for(var i=0;i<4;i++){
            dx=(i%2)*(i-2);
            dy=((i+1)%2)*(i-1);

            var neer1=physics.free({x:vehicle.model.position.x+dx*40,y:vehicle.model.position.y,z:vehicle.model.position.z+dy*40},5);
            var neer2=physics.free({x:vehicle.model.position.x+dx*60,y:vehicle.model.position.y,z:vehicle.model.position.z+dy*60},5);
            var neer3=physics.free({x:vehicle.model.position.x+dx*80,y:vehicle.model.position.y,z:vehicle.model.position.z+dy*80},5);
            var neer4=physics.free({x:vehicle.model.position.x+dx*100,y:vehicle.model.position.y,z:vehicle.model.position.z+dy*100},5);
            var coliders=neer1.coliders.concat(neer2.coliders).concat(neer3.coliders).concat(neer4.coliders);
            var pickables=neer1.pickables.concat(neer2.pickables).concat(neer3.pickables).concat(neer4.pickables);
            if(pickables.length>0){ii=i; dist=0;}
            coliders.forEach(function(el){
                if(el.driver&&el.driver.team!=vehicle.driver.team)
                {
                    if(dist<0) {dist=distanceZ(el.model.position,vehicle.model.position);
                        ii=i;
                    }
                    else
                    {
                        var ndist=distanceZ(el.model.position,vehicle.model.position);
                        if(dist>ndist){dist=ndist;
                            ii=i;
                        }
                    }
                }
            });
            
        }

        var dir=Math.floor(Math.random()*12);
        var x=(dir%2)*(dir-2)*20;
        var y=((dir+1)%2)*(dir-1)*20;
        if(ii<0){
            dx=Math.sin(vehicle.model.rotation);
            dy=Math.cos(vehicle.model.rotation);
        }
        else
        {
            dx=(ii%2)*(ii-2);
            dy=((ii+1)%2)*(ii-1);
        }
        if(dir>3){x=(dx<<0)*20;y=(dy<<0)*20};
        var cando=physics.free({x:vehicle.model.position.x+x,y:vehicle.model.position.y,z:vehicle.model.position.z+y},vehicle.size);
        cando.coliders=cando.coliders.filter(function(el){return el!=vehicle&&
            !((el instanceof Truper)&&el.driver.team!=vehicle.driver.team)&&
             !(vehicle instanceof Truper&&!el.driver);})
        if(cando.map<2&&cando.coliders.length==0&&!vehicle.exitVehicle)
            vehicle.move(x,y);
    }
    else if(vehicle.shootTimeOut<0){
        var dx=Math.sin(vehicle.model.rotation);
        var dy=Math.cos(vehicle.model.rotation);
        var friend=0;
        var foe=0;
        if(Math.abs(dx)>=1||Math.abs(dy)>=1||true){
         var neer00=physics.free({x:vehicle.model.position.x+dx*20,y:vehicle.model.position.y,z:vehicle.model.position.z+dy*20},10);
         var neer0=physics.free({x:vehicle.model.position.x+dx*40,y:vehicle.model.position.y,z:vehicle.model.position.z+dy*40},10);
         var neer1=physics.free({x:vehicle.model.position.x+dx*60,y:vehicle.model.position.y,z:vehicle.model.position.z+dy*60},10);
         var neer2=physics.free({x:vehicle.model.position.x+dx*90,y:vehicle.model.position.y,z:vehicle.model.position.z+dy*90},10);
         var neer3=physics.free({x:vehicle.model.position.x+dx*110,y:vehicle.model.position.y,z:vehicle.model.position.z+dy*110},10);
         var team=neer3.coliders.filter(function(el){
            if(el.driver&&el.driver.team==vehicle.driver.team&&el!=vehicle) return true;
            else return false;
        });
        
        var neer3=neer3.coliders.forEach(function(el){
            if(el.driver&&el.driver.team!=vehicle.driver.team) foe=1;
            if(el.driver&&el.driver.team==vehicle.driver.team) friend=1;
        });
        var neer2=neer2.coliders.forEach(function(el){
            if(el.driver&&el.driver.team!=vehicle.driver.team) foe=2;
            if(el.driver&&el.driver.team==vehicle.driver.team) friend=2;
        });
        var neer1=neer1.coliders.forEach(function(el){
            if(el.driver&&el.driver.team!=vehicle.driver.team) foe=3;
            if(el.driver&&el.driver.team==vehicle.driver.team) friend=3;
        });
        neer0.coliders.forEach(function(el){
            if(el.driver&&el.driver.team!=vehicle.driver.team) foe=4;
            if(el.driver&&el.driver.team==vehicle.driver.team&&el!=vehicle) friend=4;
        });
        neer00.coliders.forEach(function(el){
            if(el.driver&&el.driver.team==vehicle.driver.team&&el!=vehicle) friend=5;
        });

        if(foe>friend)
            vehicle.shoot();
        }
    }
    else if(vehicle.helth<20) vehicle.exit();

}
Enemy.prototype.killed=function(unit)
{
    if(unit.team==this.team)
        this.shield-=1;
    else this.shield+=1;
    if(this.shield<1)this.shield=1;
}
Enemy.prototype.getInstructions=function(vehicle,physics)
{
    var ret={a:0,w:0,s:0,d:0,e:0,f:0};
    physics.teamMembers[this.team]+=1;
    if(vehicle.model.position.x==vehicle.dest.x&&vehicle.model.position.z==vehicle.dest.z)
    {
        var dist=-1;
        var ii=-1;
        var dx=0;
        var dy=0;
        for(var i=0;i<4;i++){
            dx=(i%2)*(i-2);
            dy=((i+1)%2)*(i-1);

            var neer1=physics.free({x:vehicle.model.position.x+dx*40,y:vehicle.model.position.y,z:vehicle.model.position.z+dy*40},5);
            var neer2=physics.free({x:vehicle.model.position.x+dx*60,y:vehicle.model.position.y,z:vehicle.model.position.z+dy*60},5);
            var neer3=physics.free({x:vehicle.model.position.x+dx*80,y:vehicle.model.position.y,z:vehicle.model.position.z+dy*80},5);
            var neer4=physics.free({x:vehicle.model.position.x+dx*100,y:vehicle.model.position.y,z:vehicle.model.position.z+dy*100},5);
            var coliders=neer1.coliders.concat(neer2.coliders).concat(neer3.coliders).concat(neer4.coliders);
            var pickables=neer1.pickables.concat(neer2.pickables).concat(neer3.pickables).concat(neer4.pickables);
            if(pickables.length>0){ii=i; dist=0;}
            coliders.forEach(function(el){
                if(el.driver&&el.driver.team!=vehicle.driver.team)
                {
                    if(dist<0) {dist=distanceZ(el.model.position,vehicle.model.position);
                        ii=i;
                    }
                    else
                    {
                        var ndist=distanceZ(el.model.position,vehicle.model.position);
                        if(dist>ndist){dist=ndist;
                            ii=i;
                        }
                    }
                }
            });
            
        }

        var dir=Math.floor(Math.random()*12);
        var x=(dir%2)*(dir-2)*20;
        var y=((dir+1)%2)*(dir-1)*20;
        if(ii<0){
            dx=Math.sin(vehicle.model.rotation);
            dy=Math.cos(vehicle.model.rotation);
        }
        else
        {
            dx=(ii%2)*(ii-2);
            dy=((ii+1)%2)*(ii-1);
        }
        if(dir>3){x=(dx<<0)*20;y=(dy<<0)*20};
        var cando=physics.free({x:vehicle.model.position.x+x,y:vehicle.model.position.y,z:vehicle.model.position.z+y},vehicle.size);
        cando.coliders=cando.coliders.filter(function(el){return el!=vehicle&&
            !((el instanceof Truper)&&el.driver.team!=vehicle.driver.team)&&
             !(vehicle instanceof Truper&&!el.driver);})
        if(cando.map<2&&cando.coliders.length==0&&!vehicle.exitVehicle)
            vehicle.move(x,y);
    }
    else if(vehicle.shootTimeOut<0){
        var dx=Math.sin(vehicle.model.rotation);
        var dy=Math.cos(vehicle.model.rotation);
        var friend=0;
        var foe=0;
        if(Math.abs(dx)>=1||Math.abs(dy)>=1||true){
         var neer00=physics.free({x:vehicle.model.position.x+dx*20,y:vehicle.model.position.y,z:vehicle.model.position.z+dy*20},10);
         var neer0=physics.free({x:vehicle.model.position.x+dx*40,y:vehicle.model.position.y,z:vehicle.model.position.z+dy*40},10);
         var neer1=physics.free({x:vehicle.model.position.x+dx*60,y:vehicle.model.position.y,z:vehicle.model.position.z+dy*60},10);
         var neer2=physics.free({x:vehicle.model.position.x+dx*90,y:vehicle.model.position.y,z:vehicle.model.position.z+dy*90},10);
         var neer3=physics.free({x:vehicle.model.position.x+dx*110,y:vehicle.model.position.y,z:vehicle.model.position.z+dy*110},10);
         var team=neer3.coliders.filter(function(el){
            if(el.driver&&el.driver.team==vehicle.driver.team&&el!=vehicle) return true;
            else return false;
        });
        
        var neer3=neer3.coliders.forEach(function(el){
            if(el.driver&&el.driver.team!=vehicle.driver.team) foe=1;
            if(el.driver&&el.driver.team==vehicle.driver.team) friend=1;
        });
        var neer2=neer2.coliders.forEach(function(el){
            if(el.driver&&el.driver.team!=vehicle.driver.team) foe=2;
            if(el.driver&&el.driver.team==vehicle.driver.team) friend=2;
        });
        var neer1=neer1.coliders.forEach(function(el){
            if(el.driver&&el.driver.team!=vehicle.driver.team) foe=3;
            if(el.driver&&el.driver.team==vehicle.driver.team) friend=3;
        });
        neer0.coliders.forEach(function(el){
            if(el.driver&&el.driver.team!=vehicle.driver.team) foe=4;
            if(el.driver&&el.driver.team==vehicle.driver.team&&el!=vehicle) friend=4;
        });
        neer00.coliders.forEach(function(el){
            if(el.driver&&el.driver.team==vehicle.driver.team&&el!=vehicle) friend=5;
        });

        if(foe>friend)
            vehicle.shoot();
        }
    }
    else if(vehicle.helth<20) vehicle.exit();







    return ret;
}
var masterPlayer=null;
function Player(team)
{
    if(masterPlayer)return masterPlayer;
    this.team=team;
    this.toword={x:0,y:0};
    this.lastPos={x:0,y:0,z:0};
    this.exit=false;
    this.pasive=0;
    this.shield=1;
    masterPlayer=this;
    return this;
}
//written by Slobodan Zivkovic slobacartoonac@gmail.com
"use strict";
Player.prototype.update=function(vehicle,physics){
    this.pasive=0;
    physics.teamMembers[this.team]+=1;
    vehicle.moveToword(this.toword.x,this.toword.y);
    this.lastPos=vehicle.model.position;
    if(this.shoot)
        vehicle.shoot();
    if(this.shoot==1) this.shoot=0;
    if(this.exit)
        vehicle.exit();
    this.exit=false;
}
Player.prototype.direction=function(x,y)
{
    this.toword={x:x==null?this.toword.x:x,y:y==null?this.toword.y:y};
}
Player.prototype.killed=function(unit)
{
    if(unit.team==this.team)
        this.shield-=1;
    else this.shield+=1;
    if(this.shield<1)this.shield=1;
}
Player.prototype.getInstructions=function(vehicle,physics)
{
    this.pasive=0;
    physics.teamMembers[this.team]+=1;
    
    this.toword.y
    this.lastPos=vehicle.model.position;
    var ret={a:this.toword.x<0?1:0,w:this.toword.y>0?1:0,s:this.toword.y<0?1:0,d:this.toword.x>0?1:0,e:this.exit,f:this.shoot};
    if(this.shoot==1) this.shoot=0;
    this.exit=false;
    return ret;
}