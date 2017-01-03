//written by Slobodan Zivkovic slobacartoonac@gmail.com
"use strict";
function Projectile(shooter,model,trail,speed,range,dmg,owner)
{
    this.typeNum=0;
    this.model=model;
    this.model1=trail;
    this.speed=speed;
    this.range=range;
    this.dmg=dmg;
    this.owner=owner;
    this.shooter=shooter;
    this.light=[2.,1.5,1.5];
    this.lightsize=30;
}
Projectile.prototype.update=function(time,physics)
{
    if(!this.valid) return;
    var addx=Math.sin(this.model.rotation)*this.speed*time;
    var addy=Math.cos(this.model.rotation)*this.speed*time
    this.model.position.x+=addx;
    this.model.position.z+=addy;
    this.model1.position.x=this.model.position.x-Math.sin(this.model.rotation)*7;
    this.model1.position.z=this.model.position.z-Math.cos(this.model.rotation)*7;
    this.range-=Math.abs(addx)+Math.abs(addy);
    this.lightsize=30+Math.sin(this.range)*2;
    this.model1.size=1+Math.sin(this.range)*0.3;
    if(this.range<0) this.valid=false;
    var col=physics.free(this.model.position,2);
    if(col.map>1)
    {
        this.valid=false;
    }
    for(var i=0;i<col.coliders.length;i++)
    {
        var hit=col.coliders[i];
        if(hit!=this.shooter){
            this.valid=false;
            hit.demage({value: this.dmg,owner: this.owner},distanceZ(hit.model.position,this.model.position),physics);
        }
    }
}

function Bulet(shooter,trail,range,dmg,owner)
{
    this.typeNum=0;
    this.model=trail;
    this.range=range;
    this.dmg=dmg;
    this.owner=owner;
    this.shooter=shooter;
    this.calculated=true;
    this.anim=0.2;
    this.light=[2.,1.5,1.5];
    this.lightsize=20;
    this.rotation=this.model.rotation-Math.PI;
    this.position={x:this.shooter.model.position.x,y:this.shooter.model.position.y,z:this.shooter.model.position.z};
}
Bulet.prototype.update=function(time,physics)
{
    var addx=Math.sin(this.rotation);
    var addy=Math.cos(this.rotation);
    var tx=this.position.x;
    var ty=this.position.z;
    this.model.size=Math.sin(this.anim*Math.PI*5);
    if(this.anim<0) {this.valid=false; this.calculated=false;}
    this.anim-=time;
    while(!this.calculated&&this.range>0){
        this.range-=Math.abs(addx)+Math.abs(addy);
        var col=physics.free({x:tx,y:this.model.position.y,z:ty},2);
        if(col.map>1)
        {
            this.calculated=true;
        }
        for(var i=0;i<col.coliders.length;i++)
        {
            var hit=col.coliders[i];
            if(hit!=this.shooter){
                this.calculated=true;
                hit.demage({value: this.dmg,owner: this.owner},distanceZ(hit.model.position,{x:tx,y:this.model.position.y,z:ty}),physics);
            }
        }
        tx+=addx;
        ty+=addy;
    }
    if(!this.valid){
    this.model.position.x=tx;
    this.model.position.z=ty;
    }
    else
    {
        this.model.position.x=this.shooter.model.position.x+Math.sin(this.shooter.model.rotation)*10;
        this.model.position.z=this.shooter.model.position.z+Math.cos(this.shooter.model.rotation)*10;
        this.model.rotation=this.shooter.model.rotation+Math.PI;
    }
}



function Barr(shooter,barr,bar2)
{
    this.typeNum=1;
    this.owner=shooter;
    this.model=barr;
    this.model1=bar2;
    shooter.helthBar=true;
    barr.size={x:0.1,y:0.1,z:0.1};
    bar2.size={x:0.1,y:0.1,z:0.1};
    barr.Draw=barr.Draw1;
    bar2.Draw=bar2.Draw1;
    this.plusY=this.owner.size*0.75;
    
}
Barr.prototype.update=function(time,physics)
{
    this.model.position.x=this.owner.model.position.x+(this.owner.helthMax-this.owner.helth)/15.0;
    this.model1.position.x=this.owner.model.position.x-this.owner.helth/15.0;
    this.model1.position.z=this.model.position.z=this.owner.model.position.z;
    this.model1.position.y=this.model.position.y=this.owner.model.position.y+this.plusY;
    this.model.size={x:this.owner.helth/150.0,y:0.1,z:0.1};
    this.model1.size={x:(this.owner.helthMax-this.owner.helth)/150.0,y:0.1,z:0.1};
    if(!this.owner.valid)
    {
        this.valid=false;
    }
}

function Explosion(size,model,sphere)
{
    this.typeNum=2;
    this.model=model;
    this.size=size;
    if(!sphere)
        this.size*=2;
    this.isSphere=sphere;
    this.grow=5;
    if(!sphere)
        this.grow=10;
    model.size=0.1;//{x:0.1,y:0.1,z:0.1};
    this.light=[1,1,1];
    this.lightsize=0.1;
    //model.Draw=barr.Draw1;
    
}
Explosion.prototype.update=function(time,physics)
{
    this.model.size+=time*this.grow;
    if(this.model.size>this.size)
    {
        this.grow=-4;
    }
    if(this.model.size<(this.size/2)&&this.grow<0)
    {
        this.valid=false;
    }
    this.lightsize=this.model.size*40;
}