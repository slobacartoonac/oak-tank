//written by Slobodan Zivkovic slobacartoonac@gmail.com
"use strict";
var OAK=OAK||{};
var vecmath=require('./vecmath.js');
OAK.Lights=function()
{
    this.lights=vecmath.isGLfloat ? new Float32Array(35):new Array(35);
    this.last=0;
}
OAK.Lights.prototype.Draw=function(gl,shaderProgram)
{
    if(shaderProgram.Flights)
        gl.uniform1fv(shaderProgram.Flights, this.lights);
}
OAK.Lights.prototype.clear=function()
{
    this.last=0;
    for(var i=0;i<35;i++) this.lights[i]=0;
}
OAK.Lights.prototype.addLight=function(color,position,size)
{
    var ipos=this.last%6;
    var ind=ipos*7;
    this.lights[ind]=color[0];
    this.lights[ind+1]=color[1];
    this.lights[ind+2]=color[2];
    this.lights[ind+3]=position.x;
    this.lights[ind+4]=position.y;
    this.lights[ind+5]=position.z;
    this.lights[ind+6]=size;
    this.last+=1;
    return position;
}
if(module)
    module.exports=OAK;