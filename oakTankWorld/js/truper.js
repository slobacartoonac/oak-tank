
//written by Slobodan Zivkovic slobacartoonac@gmail.com
"use strict";
function Truper(Amodel,controler,player) {
    var model=Amodel;
    if(player&&model.numText)model.curText=player.team;
    Vehicle.call(this,Amodel,controler);
    this.dest={x:model.position.x,y:model.position.y,z:model.position.z};
    this.stable={x:model.position.x,y:model.position.y,z:model.position.z};
    this.speed=20.0;
    this.turn_speed=10;
    this.driver=player;
    this.size=2;
    this.helth=20;
    this.pose=0;
};
Truper.prototype=Object.create(PhysicalObject.prototype);
Truper.prototype.update=function(time,physics)
{
    var thisSpeed=this.speed;
    var model=this.model;

    var instructions=this.driver.getInstructions(this,physics);
    var dX=-instructions.a+instructions.d;
    var dZ=-instructions.s+instructions.w;
    var angle=Math.atan2(dX,dZ);
    
    var link=this;
    this.pose+=time*6;
    if(dX==0&&dZ==0){
        return;
    }
    model.curModel=Math.floor(this.pose);
    if(Math.abs(neerestAngle(model.rotation,angle))>this.turn_speed*time)
    {
        this.turn(time,angle);
    }
    else
    {
        model.rotation=angle;
        var podN={
            x:model.position.x+Math.sin(model.rotation)*thisSpeed*time,
            y:physics.getYDisp(model.position),
            z:model.position.z+Math.cos(model.rotation)*thisSpeed*time};
        if(this.validNewPostion(podN,physics))
        {
            model.position=podN
        }
    }
}
Truper.prototype.validNewPostion=function(newPostion,physics)
{
    var link=this;
    var coli=physics.free(newPostion,this.size);
    coli.coliders=coli.coliders.filter(function(el)
    {
        return link!=el&&(Math.abs(link.model.position.y-el.model.position.y)<10);
    });
    var host=[];
    var runOver=[];
    coli.coliders.forEach(function(el) {
        if(el instanceof Vehicle)
        {
            if(!el.driver)
            {
                host.push(el);
            }
            else
            {
                runOver.push(el);
            }
        }
    }, this);
    if(host.length>0)
    {
        this.valid=false;
        host[0].setDriver(this.driver);
    }
    if(runOver.length>0)
    {
        this.demage({owner:runOver[0].driver,value:1},2,physics);
    }
    return (coli.map==0&&coli.coliders.length==0);
}
Truper.prototype.processPickables=function(pickables)
{

}
Truper.prototype.setDriver=function(driver)
{
    this.driver=driver;
    if(this.model.numText)this.model.curText=driver.team;
}
Truper.prototype.turn=function(time,angle)
{
    var model=this.model;
    var side=neerestAngle(model.rotation,angle);

    if(side>0)model.rotation-=this.turn_speed*time;
    else model.rotation+=this.turn_speed*time;
    if(model.rotation>Math.PI)model.rotation-=2*Math.PI;
    if(model.rotation<-Math.PI)model.rotation+=2*Math.PI;
}
Truper.prototype.move=function(x,z)
{
    if(this.dest.x==this.model.position.x&&this.dest.z==this.model.position.z){
        this.stable={x:this.model.position.x,y:this.model.position.y,z:this.model.position.z};
        this.dest.x=this.model.position.x+x;
        this.dest.z=this.model.position.z+z;
        this.dest.angle=null;
    }
}
Truper.prototype.moveToword=function(x,z)
{
    if(x==0&&z==0)return;
    if(Math.atan2(x,z)==this.model.rotation&&this.dest.x==this.model.position.x&&this.dest.z==this.model.position.z){
        this.stable={x:this.model.position.x,y:this.model.position.y,z:this.model.position.z};
        this.dest.x=this.model.position.x+x;
        this.dest.z=this.model.position.z+z;
        this.dest.angle=Math.atan2(x,z);
    }
    else if(this.dest.x==this.model.position.x&&this.dest.z==this.model.position.z)
    {
        this.dest.angle=Math.atan2(x,z);
    }
}
Truper.prototype.shoot=function()
{
}
Truper.prototype.exit=function()
{
}
Truper.prototype.demage=function(dmg,distance,physics)
{
    if(distance<this.size/2)distance=this.size/2;
    this.helth-=dmg.value/distance*3;
    if(this.helth<0&&this.valid){
        this.valid=false;
        this.controler.makeBloodStain(this.model.position);
        if(this.driver)
            dmg.owner.killed(this.driver);
        var randSpawn=Math.floor(Math.random()*10);
        if(randSpawn<4)
            this.controler.createPickable(this,randSpawn,10,10);
    }
}
