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
    var thisSpeed=this.speed;
    if(this.driver)this.driver.update(this,physics);
    var model=this.model;
    var dest=this.dest;
    var dX=dest.x-model.position.x;
    var dZ=dest.z-model.position.z;
    var angle=Math.atan2(dX,dZ);
    var link=this;
    if(dX==0&&dZ==0)
        angle=model.rotation;
    if(dest.angle!=null)
        angle=dest.angle;
    if(Math.abs(neerestAngle(model.rotation,angle))>this.turn_speed*time)
    {
        this.turn(time,angle);
    }
    else
    {
        model.rotation=angle;
        var podN={x:model.position.x,y:model.position.y,z:model.position.z};
		if(dX!=0)
		{
			if(dX<0) {
                podN.x-=thisSpeed*time;
                if(podN.x<dest.x)
                    podN.x=dest.x;
            }
			else {
                podN.x+=thisSpeed*time;
                if(podN.x>dest.x)
                    podN.x=dest.x;
            }
		}
		if(dZ!=0)
		{
			if(dZ<0) 
            {
                podN.z-=thisSpeed*time;
                if(podN.z<dest.z)
                    podN.z=dest.z;
            }
			else 
            {
                podN.z+=thisSpeed*time;
                if(podN.z>dest.z)
                    podN.z=dest.z;
            }
		}
    if(physics){
        var coli=physics.free(podN,this.size);
        var trupers=coli.coliders.filter(function(el)
        {
            return (el instanceof Truper);
        });
        coli.coliders=coli.coliders.filter(function(el)
        {
            return link!=el&&!(el instanceof Truper);
        });
        if(coli.map==0&&coli.coliders.length==0) {
            model.position=podN;
            for(var i=0;i<trupers.length;i++)
                trupers[i].demage(5000,1,physics);
            if(coli.pickables.length>0)
                this.processPickables(coli.pickables);
            if(this.exitVehicle)
            {
                var cleer=physics.free(this.stable,this.size);
                if(cleer.map==0&&cleer.coliders.length==0){
                    this.controler.exit(this.stable,this.driver);
                    this.driver=null;
                    this.exitVehicle=false;
                }
            }
        }
        else
        {
            //this.valid=false;
            var tmp=this.dest;
            this.dest=this.stable;
            this.stable=tmp;
        }
    }
    else
        model.position=podN;
    }
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