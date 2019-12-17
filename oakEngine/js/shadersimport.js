  //mrckao sam Mmatrix
  var shader_vertex_source_shadowMap="\n\
attribute vec3 position;\n\
attribute vec2 uv;\n\
uniform mat4 Pmatrix, Lmatrix,Mmatrix;\n\
varying float vDepth;\n\
varying vec2 vPos;\n\
varying vec2 vUV;\n\
void main(void) {\n\
vec4 position = Pmatrix*Lmatrix*Mmatrix*vec4(position, 1.);\n\
vPos=vec2(position.x,position.z);\n\
float zBuf=position.z/position.w; //Z-buffer between -1 and 1\n\
vDepth=0.5+zBuf*0.5; //between 0 and 1\n\
gl_Position=position;\n\
vUV=uv;\n\
}";

  var shader_fragment_source_shadowMap="\n\
precision mediump float;\n\
varying float vDepth;\n\
varying vec2 vPos;\n\
varying vec2 vUV;\n\
uniform sampler2D sampler;\n\
void main(void) {\n\
    if(texture2D(sampler, vUV).a>0.3)\n\
      gl_FragColor=vec4(vDepth, 0.,vDepth,1.);\n\
}";
 /* if(vPos.x>.9||vPos.x<-0.9||vPos.y>.9||vPos.y<-0.9)\n\
    gl_FragColor=vec4(1.,0.,0.,1.);\n\
  else \n\*/

  var shader_vertex_source="\n\
attribute vec3 position, normal;\n\
attribute vec2 uv;\n\
uniform mat4 Pmatrix, Vmatrix, Mmatrix, Lmatrix, PmatrixLight;\n\
uniform float Flights[30];\n\
varying vec2 vUV;\n\
varying vec3 vNormal, vLightPos;\n\
varying vec3 mat_ambijent_add;\n\
\n\
mat3 inverse_transpose3x3(mat3 A){\n\
float determinant =    A[0][0]*(A[1][1]*A[2][2]-A[2][1]*A[1][2])\n\
                        -A[0][1]*(A[1][0]*A[2][2]-A[1][2]*A[2][0])\n\
                        +A[0][2]*(A[1][0]*A[2][1]-A[1][1]*A[2][0]);\n\
float invdet = 1.0/determinant;\n\
mat3 result=mat3(.0,.0,.0,.0,.0,.0,.0,.0,.0);\n\
result[0][0] =  (A[1][1]*A[2][2]-A[2][1]*A[1][2])*invdet;\n\
result[0][1] = -(A[0][1]*A[2][2]-A[0][2]*A[2][1])*invdet;\n\
result[0][2] =  (A[0][1]*A[1][2]-A[0][2]*A[1][1])*invdet;\n\
result[1][0] = -(A[1][0]*A[2][2]-A[1][2]*A[2][0])*invdet;\n\
result[1][1] =  (A[0][0]*A[2][2]-A[0][2]*A[2][0])*invdet;\n\
result[1][2] = -(A[0][0]*A[1][2]-A[1][0]*A[0][2])*invdet;\n\
result[2][0] =  (A[1][0]*A[2][1]-A[2][0]*A[1][1])*invdet;\n\
result[2][1] = -(A[0][0]*A[2][1]-A[2][0]*A[0][1])*invdet;\n\
result[2][2] =  (A[0][0]*A[1][1]-A[1][0]*A[0][1])*invdet;\n\
return result;\n\
}\n\
void main(void) {\n\
\n\
//Shadow mapping : \n\
vec4 lightPos = Lmatrix*Mmatrix*vec4(position, 1.);\n\
lightPos=PmatrixLight*lightPos;\n\
vec3 lightPosDNC=lightPos.xyz/lightPos.w;\n\
vLightPos=vec3(0.5,0.5,0.5)+lightPosDNC*0.5;\n\
vec4 hPos=Mmatrix*vec4(position, 1.);\n\
gl_Position = Pmatrix*Vmatrix*hPos;\n\
\n\
mat3 normalMatrix = inverse_transpose3x3(mat3(Mmatrix));\n\
vec3 nNorm=normalize(normal * normalMatrix);\n\
vNormal=normal;\n\
vUV=uv;\n\
mat_ambijent_add=vec3(.0,.0,.0);\n\
for(int i=0;i<35;i+=7)\n\
{\n\
    vec3 raz=vec3(Flights[i+3],Flights[i+4],Flights[i+5])-vec3(hPos.x,hPos.y,hPos.z);\n\
      mat_ambijent_add+=max(Flights[i+6]-length(raz),0.)/Flights[i+6]*vec3(Flights[i],Flights[i+1],Flights[i+2])*max(.3, dot(nNorm,normalize(raz)));\n\
}\n\
}";

  var shader_fragment_source="\n\
precision mediump float;\n\
uniform sampler2D sampler, samplerShadowMap;\n\
uniform vec3 source_direction;\n\
varying vec2 vUV;\n\
varying vec3 vNormal, vLightPos;\n\
varying vec3 mat_ambijent_add;\n\
const vec3 source_ambient_color=vec3(1.,1.,1.);\n\
const vec3 source_diffuse_color=vec3(1.,1.,1.);\n\
const vec3 mat_ambient_color=vec3(0.3,0.3,0.3);\n\
const vec3 mat_diffuse_color=vec3(1.,1.,1.);\n\
const float mat_shininess=10.;\n\
\n\
void main(void) {\n\
vec2 uv_shadowMap=vLightPos.xy;\n\
float shadowCoeff=0.0;\n\
float texelSize = 1.0 / 1024.0;\n\
{\n\
  for(int i=-1;i<2;i++)\n\
    for(int j=-1;j<2;j++)\n\
      shadowCoeff+=1.-smoothstep(0.005, 0.006, vLightPos.z-texture2D(samplerShadowMap, uv_shadowMap+vec2(i,j)*texelSize).r);\n\
}\n\
shadowCoeff/=9.0;\n\
vec4 color4=texture2D(sampler, vUV);\n\
vec3 color=vec3(color4);\n\
vec3 I_ambient=source_ambient_color*(mat_ambient_color+mat_ambijent_add);\n\
vec3 I_diffuse=source_diffuse_color*mat_diffuse_color*max(0., dot(vNormal, source_direction));\n\
\n\
vec3 I=I_ambient+shadowCoeff*I_diffuse;\n\
gl_FragColor = vec4(I*color, color4.a);\n\
}";

var efectVert = 
'attribute vec3 position;\n\
attribute vec2 uv;\n\
uniform mat4 Pmatrix, Vmatrix, Mmatrix;\n\
varying vec2 vUV;\n\
            void main(void) { //pre-built function\n\
               gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.);\n\
               vUV=uv;\n\
            }';

var efectFrag = '\n\
precision mediump float;\n\
uniform sampler2D sampler;\n\
varying vec2 vUV;\n\
            void main(void) {\n\
               gl_FragColor = texture2D(sampler, vUV);\n\
            }';