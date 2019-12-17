//written by Slobodan Zivkovic slobacartoonac@gmail.com
"use strict";
function PhysicalObject(model,controler)
{
    this.model=model;
    this.controler=controler;
    this.helthMax=10;
    this.helth=10;
    this.size=model.size*20;
}
PhysicalObject.prototype.update=function()
{

}
PhysicalObject.prototype.demage=function(dmg,distance,physics)
{
    if(distance<this.size)distance=this.size;
    if(this.driver&&this.driver.shield)
        dmg.value=10/(9+this.driver.shield)*dmg.value
    this.helth-=dmg.value/distance*this.size/2;
    if(!this.helthBar)
        this.controler.createBarr(this);
    if(this.helth<0&&this.valid){
        this.valid=false;
        if(this.driver)
            dmg.owner.killed(this.driver);
        if(physics){
            var link=this;
            setTimeout(function(){
            var col=physics.free(link.model.position,link.size*2);
            for(var i=0;i<col.coliders.length;i++)
            {
                var hit=col.coliders[i];
                    hit.demage({value: link.size*5, owner: dmg.owner},distanceZ(hit.model.position,link.model.position),physics);
            }
            },200);
        }
        this.controler.createExplosion(this,1.5);
        var randSpawn=Math.floor(Math.random()*20);
        if(randSpawn<4)
            this.controler.createPickable(this,randSpawn,10,10);
    }
}


function Vehicle(model,controler) {
    PhysicalObject.call(this,model,controler);
    this.dest={x:model.position.x,y:model.position.y,z:model.position.z};
    this.stable={x:model.position.x,y:model.position.y,z:model.position.z}; 
    this.speed=25.0;
    this.turn_speed=6;
    this.driver=null;
    this.helthMax=this.size*5;
    this.helth=this.helthMax;
};
Vehicle.prototype=Object.create(PhysicalObject.prototype);
Vehicle.prototype.setDriver=function(driver)
{
    if(this.model.numText)
        {
            this.model.curText=driver.team+1;
        }
    this.driver=driver;
}
Vehicle.prototype.runPickables=function(time){
    var thisSpeed=this.speed;
    if(this.upgrade[0]>0) thisSpeed*=1.25;
    if(this.upgrade[1]>0) this.shootTimeOut-=time;
    if(this.upgrade[2]>0) {this.helth=this.helthMax; this.upgrade[2]=0};
    if(this.upgrade[3]>0) {this.helth=this.helthMax;};
    for(var i=0;i<this.upgrade.length;i++) this.upgrade[i]-=time;
    return thisSpeed;
}
Vehicle.prototype.validNewPostion=function(newPostion,physics,thtype)
{
    if(!thtype)thtype=1;
    var link=this;
    var coli=physics.free(newPostion,this.size-1);
    coli.coliders=coli.coliders.filter(function(el)
    {
        return link!=el&&!(el instanceof Truper)&&(Math.abs(link.model.position.y-el.model.position.y)<link.size/2);
    });

    if(coli.pickables.length>0)
                this.processPickables(coli.pickables);
    var ret=(coli.map<thtype&&coli.coliders.length==0)
    if(!ret)  this.exitVehicle=false;
    return ret;
}
Vehicle.prototype.processPickables=function(pickables)
{
    for(var i=0;i<pickables.length;i++)
        {
            this.upgrade[pickables[i].type]=pickables[i].duration;
            pickables[i].valid=false;
        }
}

Vehicle.prototype.update=function(time,physics)
{

}
Vehicle.prototype.corectPostition=function(physics,time,baseh)
{
    var model=this.model;
    if(colide(this.stable,model.position,8))
        {
            //fix atangemant to ease up moving trough town
            var podN={
            x:model.position.x,
            y:model.position.y,
            z:model.position.z};
            if(Math.abs(Math.sin(model.rotation))<Math.abs(Math.cos(model.rotation))){
                var razx=(this.stable.x-podN.x);
                var razxa=Math.abs(razx);
                if(razxa>time*this.speed/2){
                    razx/=razxa/this.speed*2;
                    podN.x+=razx*time;
                }
                else podN.x=this.stable.x;
            }
            else
            {
                var razz=(this.stable.z-podN.z);
                var razza=Math.abs(razz);
                if(razza>time*this.speed/2){
                    razz/=razza/this.speed*2;
                    podN.z+=razz*time;
                }
                else podN.z=this.stable.z;
            }
            if(this.validNewPostion(podN,physics))
            {
                this.newPosition(podN,baseh);
            }
        }
}
Vehicle.prototype.newPosition=function(podN,baseh){
    this.model.position=podN;
    this.stable={x:(((podN.x+10)/20)<<0)*20,y:podN.y,z:(((podN.z+10)/20)<<0)*20};
}
Vehicle.prototype.turn=function(time,angle)
{
    var model=this.model;
    var side=neerestAngle(model.rotation,angle);

    if(side>0)model.rotation-=this.turn_speed*time;
    else model.rotation+=this.turn_speed*time;
    if(model.rotation>Math.PI)model.rotation-=2*Math.PI;
    if(model.rotation<-Math.PI)model.rotation+=2*Math.PI;
}
Vehicle.prototype.move=function(x,z)
{
    if(this.dest.x==this.model.position.x&&this.dest.z==this.model.position.z){
        this.stable={x:this.model.position.x,y:this.model.position.y,z:this.model.position.z};
        this.dest.x=this.model.position.x+x;
        this.dest.z=this.model.position.z+z;
        this.dest.angle=null;
    }
}
Vehicle.prototype.moveToword=function(x,z)
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
Vehicle.prototype.shoot=function()
{

}
Vehicle.prototype.exit=function()
{   
    this.exitVehicle=true;
}