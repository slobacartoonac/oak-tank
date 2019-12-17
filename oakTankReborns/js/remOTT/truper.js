function Truper(Amodel,controler,player) {
    var model=Amodel;
    if(model.numText)model.curText=player.team;
    PhysicalObject.call(this,Amodel,controler);
    this.dest={x:model.position.x,y:model.position.y,z:model.position.z};
    this.stable={x:model.position.x,y:model.position.y,z:model.position.z};
    this.speed=20.0;
    this.turn_speed=10;
    this.driver=null;
    this.size=2;
    this.helth=20;
    this.driver=player;
    this.pose=0;
};
Truper.prototype=Object.create(PhysicalObject.prototype);
Truper.prototype.update=function(time,physics)
{
    var thisSpeed=this.speed;

    if(this.driver)this.driver.update(this,physics);
    var model=this.model;
    var dest=this.dest;
    var dX=dest.x-model.position.x;
    var dZ=dest.z-model.position.z;
    var angle=Math.atan2(dX,dZ);
    var link=this;
    this.pose+=time*6;
    if(dX==0&&dZ==0){
        angle=model.rotation;
        this.pose=0;
    }
    model.curModel=Math.floor(this.pose);
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
        coli.coliders=coli.coliders.filter(function(el)
        {
            return link!=el&&(Math.abs(link.model.position.y-el.model.position.y)<10);
        });
        if(coli.map==0&&coli.coliders.length==0) {
            model.position=podN;
            //if(coli.pickables.length>0)
            //    this.processPickables(coli.pickables);
        }
        else
        {
            var host=coli.coliders.filter(function(el)
                {
                    return !el.driver&&el instanceof Vehicle;
                });
            if(host.length>0)
            {
                this.valid=false;
                host[0].setDriver(this.driver);
            }
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
Truper.prototype.processPickables=function(pickables)
{

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
    this.helth-=dmg/distance*3;
    if(this.helth<0&&this.valid){
        this.valid=false;
        var randSpawn=Math.floor(Math.random()*10);
        if(randSpawn<4)
            this.controler.createPickable(this,randSpawn,10,10);
    }
}
