
function Choper(model,model1,controler) {
    Vehicle.call(this,model,controler);
    this.model1=model1;
    this.dest={x:model.position.x,y:model.position.y,z:model.position.z};
    this.stable={x:model.position.x,y:model.position.y,z:model.position.z};
    this.upgrade=[0,0,0,0];//4upgrades speed refresh helth invinsability 
    this.speed=30.0;
    this.turn_speed=5;
    this.driver=null;
    this.helthMax=this.size*3;
    this.helth=this.helthMax;
    this.shootTimeOut=2;
    this.elise_speed=0;
    this.flyHeight=15;
    this.shootSpeed=0.8;
};
Choper.prototype=Object.create(Vehicle.prototype);
Choper.prototype.flyUp=function(time)
{
    if(this.exitVehicle&&this.dest.x==this.model.position.x&&this.dest.z==this.model.position.z)
    {
        if(this.model.position.y>0)
            this.model.position.y-=time*5;
        if(this.model.position.y<0)
            this.model.position.y=0;
    }
    else if(this.driver)
    {
        if(this.model.position.y<this.flyHeight&&this.elise_speed>1)
            this.model.position.y+=time*5;
        if(this.model.position.y>this.flyHeight)
            this.model.position.y=this.flyHeight;
    }
    if(this.driver){
        this.elise_speed+=time*0.5;
        if(this.elise_speed>2) this.elise_speed=2;
        }
    else
        {
            this.elise_speed-=time*0.5;
            if(this.elise_speed<0) this.elise_speed=0;
        }
    if(this.model1.numText)
        {
            this.model1.curText=this.elise_speed>0.5?1:0;
        }
    this.model1.rotation+=this.elise_speed;
    this.model1.position.y=this.model.position.y+10;
}

Choper.prototype.update=function(time,physics)
{
    this.flyUp(time);
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
        if(this.model.position.y>this.flyHeight/2)
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
        if(coli.map<2&&coli.coliders.length==0) {
            this.newPosition(podN);
            if(coli.pickables.length>0)
                this.processPickables(coli.pickables);
            if(this.exitVehicle&&this.model.position.y==0)
            {
                var cleer=physics.free(this.stable,this.size);
                if(cleer.map==0&&cleer.coliders.length==0){
                    this.controler.exit({x:this.stable.x,y:0,z:this.stable.z},this.driver);
                    this.driver=null;
                    this.exitVehicle=false;
                }
                else this.exitVehicle=false;
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
    else this.newPosition(podN);
    }
}
Choper.prototype.newPosition=function(podN)
{
    if(this.model.position.y==this.flyHeight)
        this.model.position=podN;
        this.model1.position.x=podN.x;
        this.model1.position.z=podN.z;
}

Choper.prototype.shoot=function()
{
    if(this.shootTimeOut<0){
        this.shootTimeOut=this.shootSpeed;
        this.controler.shoot(this,0,this.model.rotation,100,80,45);
    }
}

