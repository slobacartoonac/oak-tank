function tempControler(engine,physics,sound)
{
    this.engine=engine;
    this.temps=[];
    this.physics=physics;
    this.latetems=[];
    this.sound=sound;
}
tempControler.prototype.update=function(time)
{
    var link=this;
    for(var i=0;i<this.temps.length;i++)
        this.temps[i].update(time,this.physics);
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
    this.add(new Projectile(shooter,proj,trail,speed,range,dmg));
}
tempControler.prototype.shootB=function(shooter,height,rotation,range,dmg)
{
    this.sound.playSound(shooter.model.position,'shot');
    var trail=this.engine.getEfect({x:shooter.model.position.x+Math.sin(rotation)*10,y:shooter.model.position.y+height,z:shooter.model.position.z+Math.cos(rotation)*10},'trail','trail',true);
    trail.rotation=rotation+Math.PI;
    this.add(new Bulet(shooter,trail,range,dmg));
}

tempControler.prototype.createBarr=function(shooter)
{
    var barr=this.engine.getEfect({x:shooter.model.position.x,y:shooter.model.position.y+shooter.size*0.75,z:shooter.model.position.z},'cone','power',true);
    this.add(new Barr(shooter,barr));
}
tempControler.prototype.createExplosion=function(shooter,size)
{
    if(size>1){
        this.sound.playSound(shooter.model.position,'explosion');
        this.engine.getEfect({x:shooter.model.position.x,y:1,z:shooter.model.position.z},'plane','dirt',true).size=shooter.model.size;
        var model=this.engine.getEfect({x:shooter.model.position.x,y:2,z:shooter.model.position.z},'plane','star',true);
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
    trup=new Truper(engine.getAObject(position,['mans','manl','mans','manr'],['mangreen','manblue','manred'],true),this,driver);
    this.physics.addColider(trup);
    this.add(trup);
}