
function Tank(model,controler) {
    Vehicle.call(this,model,controler);
    this.dest={x:model.position.x,y:model.position.y,z:model.position.z};
    this.stable={x:model.position.x,y:model.position.y,z:model.position.z};
    this.upgrade=[0,0,0,0];//4upgrades speed refresh helth invinsability 
    this.speed=25.0;
    this.turn_speed=6;
    this.driver=null;
    this.helth=this.size*5;
    this.shootTimeOut=2;
    this.shootSpeed=2;
};
Tank.prototype=Object.create(Vehicle.prototype);

Tank.prototype.update=function(time,physics)
{
    this.shootTimeOut-=time;
    var thisSpeed=this.runPickables(time);

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
            return link!=el&&!(el instanceof Truper)&&(Math.abs(link.model.position.y-el.model.position.y)<10);
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

Tank.prototype.shoot=function()
{
    if(this.shootTimeOut<0){
        this.shootTimeOut=this.shootSpeed;
        this.controler.shoot(this,this.size/2.15,this.model.rotation,60,120,45);
    }
}

function TankGun(model,controler) {
    Tank.call(this,model,controler);
    this.upgrade=[0,0,0,0];//4upgrades speed refresh helth invinsability 
    this.speed=28.0;
    this.turn_speed=7;
    this.driver=null;
    this.helth=this.size*4;
    this.shootTimeOut=2;
    this.shootSpeed=1.5;
};
TankGun.prototype=Object.create(Tank.prototype);
TankGun.prototype.shoot=function()
{
    if(this.shootTimeOut<0){
        this.shootTimeOut=this.shootSpeed;
        this.controler.shootB(this,this.size/2.5,this.model.rotation,90,28);
    }
}
