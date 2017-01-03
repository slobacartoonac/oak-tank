//written by Slobodan Zivkovic slobacartoonac@gmail.com
"use strict";
function Sound(sound,player)
{
	this.sound=sound;
    this.player=player;
    this.sounds=[];
}
Sound.prototype.playSound=function(pos,sId)
{
    var dist=distanceZ(this.player.lastPos,pos);
    if(dist>200)return;
    var sorce=this.sound.playSound(sId,this.processVoume(pos));
    sorce.p=pos;
    this.sounds.push(sorce);
}
Sound.prototype.update=function()
{
    var link=this;
    this.sounds=this.sounds.filter(function(el){
        if(el.end)
        {   el.s.disconnect();
            //el.s.parentNode.removeChild(el.s);
            el.v.disconnect();
            //el.v.parentNode.removeChild(el.v);
        return false;
        }
        el.v.gain.value=link.processVoume(el.p);
        return true;
    })
}
Sound.prototype.processVoume=function(pos)
{
    var value = distanceZ(this.player.lastPos,pos);
    if(value<20) return 1;
    value=20/value;
    if(!isNaN(parseFloat(value)) && isFinite(value) && value>0) 
        return value;
   else 
        return 0;
}