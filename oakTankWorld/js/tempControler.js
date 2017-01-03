//written by Slobodan Zivkovic slobacartoonac@gmail.com
"use strict";
function tempControler(engine,physics,sound)
{
    this.engine=engine;
    this.temps=[];
    this.physics=physics;
    this.latetems=[];
    this.sound=sound;
    this.player=new EnemyAI(0);
}
tempControler.prototype.update=function(time)
{
    this.player.pasive++;
    this.engine.lights.clear();
    var link=this;
    for(var i=0;i<this.temps.length;i++){
        this.temps[i].update(time,this.physics);
        if(this.temps[i].light)
            this.engine.lights.addLight(this.temps[i].light,this.temps[i].model1?this.temps[i].model1.position:this.temps[i].model.position,this.temps[i].lightsize);    
    }
    this.temps=this.temps.filter(function(el){
        if(el.valid)
            return true;
        else 
        {
            link.unbind(el);
            return false;
        }
    });
    while(this.latetems.length>0)
        this.createExplosion(this.latetems.pop(),0.5);
}
tempControler.prototype.unbind=function(el)
{
    if(el.phyEnable)
        this.physics.removeColider(el);
    if(el.typeNum==0)
        this.latetems.push(el);
    this.engine.remObject(el.model);
    if(el.model1) this.engine.remObject(el.model1);
}
tempControler.prototype.invalidate=function()
{
    var link=this;
    this.temps=this.temps.filter(function(el){
            link.unbind(el);
            return false;
    });
}

tempControler.prototype.add=function(temp)
{
    temp.valid=true;
    this.temps.push(temp);
}
tempControler.prototype.shoot=function(shooter,height,rotation,speed,range,dmg)
{
    this.sound.playSound(shooter.model.position,'launch');
    var proj=this.engine.getObject({x:shooter.model.position.x+Math.sin(rotation)*7,y:shooter.model.position.y+height,z:shooter.model.position.z+Math.cos(rotation)*7},'proj','grid',true);
    var trail=this.engine.getEfect({x:shooter.model.position.x,y:shooter.model.position.y+height,z:shooter.model.position.z},'trail','trail',true);
    proj.rotation=rotation;
    trail.rotation=rotation;
    this.add(new Projectile(shooter,proj,trail,speed,range,dmg,shooter.driver));
}
tempControler.prototype.shootB=function(shooter,height,rotation,range,dmg)
{
    this.sound.playSound(shooter.model.position,'shot');
    var trail=this.engine.getEfect({x:shooter.model.position.x+Math.sin(rotation)*10,y:shooter.model.position.y+height,z:shooter.model.position.z+Math.cos(rotation)*10},'trail','trail',true);
    trail.rotation=rotation+Math.PI;
    this.add(new Bulet(shooter,trail,range,dmg,shooter.driver));
}

tempControler.prototype.createBarr=function(shooter)
{
    var barr=this.engine.getEfect({x:shooter.model.position.x,y:shooter.model.position.y+shooter.size*0.75,z:shooter.model.position.z},'cone','power1',true);
    var barr1=this.engine.getEfect({x:shooter.model.position.x,y:shooter.model.position.y+shooter.size*0.75,z:shooter.model.position.z},'cone','power',true);
    this.add(new Barr(shooter,barr,barr1));
}
tempControler.prototype.createExplosion=function(shooter,size)
{
    var link=this;
    if(size>1){
        this.sound.playSound(shooter.model.position,'explosion');
        var forTimeDec=this.engine.getObject({x:shooter.model.position.x,y:link.physics.getYDisp(shooter.model.position)+1,z:shooter.model.position.z},'plane','dirt',true);
        forTimeDec.size=shooter.model.size;
        setTimeout(function(){link.engine.remObject(forTimeDec);},10000);
        var model=this.engine.getEfect({x:shooter.model.position.x,y:link.physics.getYDisp(shooter.model.position)+2,z:shooter.model.position.z},'plane','star',true);
        this.add(new Explosion(size*shooter.model.size,model,false));
    }
    var model1=this.engine.getEfect({x:shooter.model.position.x,y:shooter.model.position.y+size*5,z:shooter.model.position.z},'explosion','explosion',true);
    this.add(new Explosion(size,model1,true));
    
}
tempControler.prototype.createPickable=function(shooter,type,life,duration)
{
    var model=null;
    //speed refresh helth invinsability 
    if(type==0)
        var model=this.engine.getObject({x:shooter.model.position.x,y:shooter.model.position.y,z:shooter.model.position.z},'pcube','pspeed',true);
    if(type==1)
        var model=this.engine.getObject({x:shooter.model.position.x,y:shooter.model.position.y,z:shooter.model.position.z},'pcube','pgun',true);
    if(type==2)
        var model=this.engine.getObject({x:shooter.model.position.x,y:shooter.model.position.y,z:shooter.model.position.z},'pcube','phelth',true);
    if(type==3)
        var model=this.engine.getObject({x:shooter.model.position.x,y:shooter.model.position.y,z:shooter.model.position.z},'pcube','pinvins',true);
        
    var pick=new Pickable(type,life,duration,model);
    this.physics.addPickable(pick)
    this.add(pick);
}
tempControler.prototype.exit=function(position,driver)
{
    var trup=new Truper(this.engine.getAObject(position,['mans','manl','mans','manr'],['mangreen','manblue','manred'],true),this,driver);
    this.physics.addColider(trup);
    this.add(trup);
    return trup;
}
tempControler.prototype.makeBloodStain=function(position)
{
    var link=this;

        var stain=this.engine.getObject({x:position.x,y:link.physics.getYDisp(position)+1,z:position.z},'plane','bloodstain',true);
        stain.size=0.4;
        setTimeout(function(){link.engine.remObject(stain);},10000);

}
tempControler.prototype.sceneScope=function(position)
{
    if(this.player.pasive<3){
    return colide(position,this.player.lastPos,240);
    }
    return 1;
}