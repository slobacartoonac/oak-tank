//written by Slobodan Zivkovic slobacartoonac@gmail.com
"use strict";
var vecmath={};
vecmath.isGLfloat=typeof Float32Array!="undefined";
vecmath.pomararay=vecmath.isGLfloat ? new Float32Array(16):new Array(16);
vecmath.pomararay3=vecmath.isGLfloat ? new Float32Array(9):new Array(9);
vecmath.getInit3 = function () { return  vecmath.isGLfloat ? vecmath.indentZerro3(new Float32Array(9)) : [1,0,0,0,1,0,0,0,1];}
vecmath.getInit = function () { return  vecmath.isGLfloat ? vecmath.indentZerro(new Float32Array(16)) : [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];}
vecmath.indentZerro =function (p){ p[0]=1;p[5]=1;p[10]=1;p[15]=1;return p;}
vecmath.indentZerro3 =function (p){ p[0]=1;p[4]=1;p[8]=1; return p;}
vecmath.indentCopy=vecmath.getInit();
vecmath.indent=function (p){for(var i=0; i<16;i++)p[i]=vecmath.indentCopy[i];}
vecmath.perspective=function(wiewAngle,aspect,zNear,zFar)
{
var ret= vecmath.isGLfloat ? new Float32Array(16):new Array(16);
var f=1/Math.tan(wiewAngle/2);
ret[0]=f/aspect;
ret[5]=f;
ret[10]=(zFar+zNear)/(zNear-zFar);
ret[14]=-1;
ret[11]=(2*zFar*zNear)/(zNear-zFar);
return ret;
}
vecmath.orthogonal=function(heigth,aspect,zNear,zFar)
{
var ret= vecmath.isGLfloat ? new Float32Array(16):new Array(16);
ret[0]=2/heigth/aspect;
ret[5]=2/heigth;
ret[10]=-2/(zFar-zNear);
ret[14]=-(zNear+zFar)/(zFar-zNear);
ret[15]=1.;

return ret;
}

//[100.0/canvas.width,0,0,0, 0,100.0/canvas.height,0,0, 0,0,1.0/(100-1),-1.0/(100-1), 0,0,0,1];
vecmath.rotate=function(p,angle,s,ret)
{
  var l=s[0];
  var m=s[1];
  var n=s[2];
  if(!ret)
    ret= vecmath.isGLfloat ? new Float32Array(16):new Array(16);
  var matcos=(1-Math.cos(angle));
  var sint=Math.sin(angle)
  var cost=Math.cos(angle);
  
  ret[0]=l*l*matcos+cost;//
  ret[4]=m*l*matcos-n*sint;
  ret[8]=n*l*matcos+m*sint;
  
  ret[1]=l*l*matcos+n*sint;
  ret[5]=m*m*matcos+cost;//
  ret[9]=n*l*matcos-l*sint;
  
  ret[2]=l*n*matcos-m*sint;
  ret[6]=m*n*matcos+l*sint;
  ret[10]=n*n*matcos+cost;//
  
  ret[15]=1;
  ret=vecmath.multiplay(ret,p);
  return ret;
};


vecmath.rotatef=function(p,angle,s,ret){

var l=s[0];
  var m=s[1];
  var n=s[2];

  if(!ret)
     ret= vecmath.pomararay;//vecmath.isGLfloat ? new Float32Array(16):new Array(16);
  var a=vecmath.pomararay3;//vecmath.isGLfloat ? new Float32Array(9):new Array(9);
  var matcos=(1-Math.cos(angle));
  var sint=Math.sin(angle)
  var cost=Math.cos(angle);

   a[0]=l*l*matcos+cost;//
   a[1]=l*m*matcos+n*sint;
   a[2]=l*n*matcos-m*sint;
   a[3]=m*l*matcos-n*sint;
   a[4]=m*m*matcos+cost;//
   a[5]=m*n*matcos+l*sint;
   a[6]=n*l*matcos+m*sint;
   a[7]=n*m*matcos-l*sint;
   a[8]=n*n*matcos+cost;//

  ret[0]=a[0]*p[0]+a[1]*p[4]+a[2]*p[8];
  ret[1]=a[0]*p[1]+a[1]*p[5]+a[2]*p[9];
  ret[2]=a[0]*p[2]+a[1]*p[6]+a[2]*p[10];
  ret[3]=a[0]*p[3]+a[1]*p[7]+a[2]*p[11];
  
  ret[4]=a[3]*p[0]+a[4]*p[4]+a[5]*p[8];
  ret[5]=a[3]*p[1]+a[4]*p[5]+a[5]*p[9];
  ret[6]=a[3]*p[2]+a[4]*p[6]+a[5]*p[10];
  ret[7]=a[3]*p[3]+a[4]*p[7]+a[5]*p[11];
  
  ret[8]=a[6]*p[0]+a[7]*p[4]+a[8]*p[8];
  ret[9]=a[6]*p[1]+a[7]*p[5]+a[8]*p[9];
  ret[10]=a[6]*p[2]+a[7]*p[6]+a[8]*p[10];
  ret[11]=a[6]*p[3]+a[7]*p[7]+a[8]*p[11];
  
  
  p[0]=ret[0];
  p[1]=ret[1];
  p[2]=ret[2];
  p[3]=ret[3];
  
  p[4]=ret[4];
  p[5]=ret[5];
  p[6]=ret[6];
  p[7]=ret[7];
  
  p[8]=ret[8];
  p[9]=ret[9];
  p[10]=ret[10];
  p[11]=ret[11];
  
  return p;

}

vecmath.translate=function (p,s)
{
  var x=s[0];
  var y=s[1];
  var z=s[2];
  var ret=vecmath.getInit();
  ret[12]+=x;
  ret[13]+=y;
  ret[14]+=z;
  return vecmath.multiplay(ret,p);
  
};
vecmath.translatef=function (p,s)
{
var x=s[0];
  var y=s[1];
  var z=s[2];
  p[12]=x*p[0]+y*p[4]+z*p[8]+p[12];
  p[13]=x*p[1]+y*p[5]+z*p[9]+p[13];
  p[14]=x*p[2]+y*p[6]+z*p[10]+p[14];
  p[15]=x*p[3]+y*p[7]+z*p[11]+p[15];

  return p;
  
};
vecmath.multiplay=function(a,b,ret)
{
  if(!ret)
    ret= vecmath.isGLfloat ? new Float32Array(16):new Array(16);
  ret[0]=a[0]*b[0]+a[1]*b[4]+a[2]*b[8]+a[3]*b[12];
  ret[1]=a[0]*b[1]+a[1]*b[5]+a[2]*b[9]+a[3]*b[13];
  ret[2]=a[0]*b[2]+a[1]*b[6]+a[2]*b[10]+a[3]*b[14];
  ret[3]=a[0]*b[3]+a[1]*b[7]+a[2]*b[11]+a[3]*b[15];
  
  ret[4]=a[4]*b[0]+a[5]*b[4]+a[6]*b[8]+a[7]*b[12];
  ret[5]=a[4]*b[1]+a[5]*b[5]+a[6]*b[9]+a[7]*b[13];
  ret[6]=a[4]*b[2]+a[5]*b[6]+a[6]*b[10]+a[7]*b[14];
  ret[7]=a[4]*b[3]+a[5]*b[7]+a[6]*b[11]+a[7]*b[15];
  
  ret[8]=a[8]*b[0]+a[9]*b[4]+a[10]*b[8]+a[11]*b[12];
  ret[9]=a[8]*b[1]+a[9]*b[5]+a[10]*b[9]+a[11]*b[13];
  ret[10]=a[8]*b[2]+a[9]*b[6]+a[10]*b[10]+a[11]*b[14];
  ret[11]=a[8]*b[3]+a[9]*b[7]+a[10]*b[11]+a[11]*b[15];
  
  ret[12]=a[12]*b[0]+a[13]*b[4]+a[14]*b[8]+a[15]*b[12];
  ret[13]=a[12]*b[1]+a[13]*b[5]+a[14]*b[9]+a[15]*b[13];
  ret[14]=a[12]*b[2]+a[13]*b[6]+a[14]*b[10]+a[15]*b[14];
  ret[15]=a[12]*b[3]+a[13]*b[7]+a[14]*b[11]+a[15]*b[15];
  return ret;
}
vecmath.transpse=function(a)
{
  var ret= vecmath.isGLfloat ? new Float32Array(16):new Array(16);
  ret[0]=a[0];
  ret[1]=a[4];
  ret[2]=a[8];
  ret[3]=a[12];
  
  ret[4]=a[1];
  ret[5]=a[5];
  ret[6]=a[9];
  ret[7]=a[13];
  
  ret[8]=a[2];
  ret[9]=a[6];
  ret[10]=a[10];
  ret[11]=a[14];
  
  ret[12]=a[3];
  ret[13]=a[7];
  ret[14]=a[11];
  ret[15]=a[15];
  a=ret;
}
vecmath.transpse3=function(a)
{
  var ret= vecmath.isGLfloat ? new Float32Array(16):new Array(16);
  ret[0]=a[0];
  ret[1]=a[3];
  ret[2]=a[6];

  
  ret[3]=a[1];
  ret[4]=a[4];
  ret[5]=a[7];

  
  ret[6]=a[2];
  ret[7]=a[5];
  ret[8]=a[8];

  a=ret;
}
vecmath.inverse_transpose3x3from4=function(A,result){
  //0,1,2 3,4,5  6,7,8 
  //0,1,2 4,5,6 9,10,11
var determinant =    A[0]*(A[5]*A[11]-A[10]*A[6])
                        -A[1]*(A[4]*A[11]-A[6]*A[9])
                        +A[2]*(A[4]*A[10]-A[5]*A[9]);
if(determinant==0)  return this.getInit3();
var invdet = 1.0/determinant;
if(!result)
  result=vecmath.isGLfloat ? new Float32Array(9):new Array(9);
result[0] =  (A[4]*A[8]-A[7]*A[5])*invdet;
result[1] = -(A[1]*A[8]-A[2]*A[7])*invdet;
result[2] =  (A[1]*A[5]-A[2]*A[4])*invdet;
result[3] = -(A[3]*A[8]-A[5]*A[6])*invdet;
result[4] =  (A[0]*A[8]-A[2]*A[6])*invdet;
result[5] = -(A[0]*A[5]-A[3]*A[2])*invdet;
result[6] =  (A[3]*A[7]-A[6]*A[4])*invdet;
result[7] = -(A[0]*A[7]-A[6]*A[1])*invdet;
result[8] =  (A[0]*A[4]-A[3]*A[1])*invdet;
return result;
}


