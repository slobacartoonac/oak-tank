function Pickable(type,life,duration,model)
{
    this.model=model;
    this.type=type;
    this.duration=duration;
    this.helth=life;
    this.size=10;
}
Pickable.prototype.update=function(time)
{
    this.helth-=time;
    this.model.rotation+=time;
    this.model.position.y+=Math.sin(this.model.rotation)*0.05;
    if(this.helth<0)
        this.valid=false;
}