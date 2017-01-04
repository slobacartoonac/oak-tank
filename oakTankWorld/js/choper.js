//written by Slobodan Zivkovic slobacartoonac@gmail.com
"use strict";
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
    this.flyHeight=17;
    this.shootSpeed=0.65;
};
Choper.prototype=Object.create(Vehicle.prototype);
Choper.prototype.flyUp=function(time,targeth)
{
    if(this.driver)
    {
        var razh=targeth-this.model.position.y;
        if(Math.abs(razh)>0.5){
            if(razh>0&&this.elise_speed>1)
                this.model.position.y+=time*5;
            if(razh<0)
            this.model.position.y-=time*5;
        } else this.model.position.y=targeth;

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
    if(!this.controler.sceneScope(this.model.position)) return;
    this.shootTimeOut-=time;
    var thisSpeed=this.runPickables(time);
    var instructions=this.driver?this.driver.getInstructions(this,physics):{a:0,w:0,s:0,d:0,e:0,f:0};
    var model=this.model;

    if(instructions.e) 
        this.exitVehicle=true;
    if(instructions.f) this.shoot();

    var model=this.model;

    var groundh=physics.getYDisp(this.model.position);
    var basehf=physics.getYDisp({x:model.position.x+20*Math.sin(angle),y:model.position.y,z:model.position.z+20*Math.cos(angle)});
    var baseh=(groundh+basehf)/2;
    var targeth=baseh+this.flyHeight;

    var razh=physics.getYDisp(this.model.position)-this.model.position.y;
    var theActual=this.exitVehicle?groundh:targeth;
    if(this.validNewPostion({x:model.position.x,y:theActual,z:model.position.z},physics,2))
        this.flyUp(time,theActual);
    else 
        this.flyUp(time,model.position.y+1);
    if(this.exitVehicle&&Math.abs(razh)<0.5)
    {
        var toExit={
                    x:model.position.x+Math.sin(model.rotation+Math.PI)*this.size*0.65,
                    y:physics.getYDisp(model.position),
                    z:model.position.z+Math.cos(model.rotation+Math.PI)*this.size*0.65};
        var cleer=physics.free(toExit,2);
        
        if(cleer.map==0&&cleer.coliders.length==0){
            this.controler.exit(toExit,this.driver);
            this.driver=null;
            this.exitVehicle=false;
            return;
        }
        else this.exitVehicle=false;
    }

    /*if(this.exitVehicle&&this.model.position.y==baseh)
    {
        var cleer=physics.free(this.stable,this.size);
        if(cleer.map==0&&cleer.coliders.length==0){
            this.controler.exit({x:this.stable.x,y:0,z:this.stable.z},this.driver);
            this.driver=null;
            this.exitVehicle=false;
        }
        else this.exitVehicle=false;
    }*/

    var dX=-instructions.a+instructions.d;
    var dZ=-instructions.s+instructions.w;
    var angle=Math.atan2(dX,dZ);
    var link=this;

    if(dX==0&&dZ==0)
        return;
    
    if(Math.abs(neerestAngle(model.rotation,angle))>this.turn_speed*time)
    {
        if(this.model.position.y-baseh>this.flyHeight/3){
         this.turn(time,angle);
    }
        
    }
    else
    {
        model.rotation=angle;
        var podN={
            x:model.position.x+Math.sin(model.rotation)*thisSpeed*time,
            y:model.position.y,
            z:model.position.z+Math.cos(model.rotation)*thisSpeed*time};
         /*if(this.validNewPostion(podN,physics)){
            model.position=podN;
            this.stable={x:(((podN.x+10)/20)<<0)*20,y:podN.y,z:(((podN.z+10)/20)<<0)*20};
        }*/
        if(this.validNewPostion(podN,physics,2)) {
            this.newPosition(podN,baseh);
            
        }
        else this.corectPostition(physics,time,baseh);
    }
}
Choper.prototype.newPosition=function(podN,baseh)
{
    if(this.model.position.y-baseh>this.flyHeight/2){
        this.model.position=podN;
        this.model1.position.x=podN.x;
    this.model1.position.z=podN.z;
    this.stable={x:(((podN.x+10)/20)<<0)*20,y:podN.y,z:(((podN.z+10)/20)<<0)*20};
    }
    
}

Choper.prototype.shoot=function()
{
    if(this.shootTimeOut<0){
        this.shootTimeOut=this.shootSpeed;
        this.controler.shoot(this,0,this.model.rotation+Math.random()*0.1-0.05,100,80+Math.random()*10,45);
    }
}

