  var shader_attribure_source1=["position","normal","uv"];
  var shader_uniform_source1=["sampler","samplerShadowMap","sampler2","Flights","source_direction","inv_trans",
  "Pmatrix","Vmatrix","Mmatrix","Lmatrix","PmatrixLight"];
  
  var shader_vertex_source1="\n\
attribute vec3 position, normal;\n\
attribute vec2 uv;\n\
uniform mat4 Pmatrix, Vmatrix, Mmatrix, Lmatrix, PmatrixLight;\n\
varying vec2 vUV;\n\
varying vec3 vNormal, vLightPos;\n\
varying vec3 hPos;\n\
\n\
void main(void) {\n\
\n\
//Shadow mapping : \n\
vec4 lightPos = Lmatrix*Mmatrix*vec4(position, 1.);\n\
lightPos=PmatrixLight*lightPos;\n\
vec3 lightPosDNC=lightPos.xyz/lightPos.w;\n\
vLightPos=vec3(0.5,0.5,0.5)+lightPosDNC*0.5;\n\
vec3 rPos=vec3(Mmatrix*vec4(position, 1.));\n\
hPos=rPos;\n\
gl_Position = Pmatrix*Vmatrix*vec4(rPos, 1.);\n\
vNormal=normal;\n\
vUV=uv;\n\
}";
/*mat3 inverse_transpose3x3(mat3 A){\n\
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
}\n\ */

  var shader_fragment_source1="\n\
precision mediump float;\n\
uniform sampler2D sampler, samplerShadowMap;\n\
uniform float Flights[30];\n\
uniform vec3 source_direction;\n\
uniform mat3 inv_trans;\n\
varying vec2 vUV;\n\
varying vec3 vNormal, vLightPos;\n\
varying vec3 hPos;\n\
const vec3 source_ambient_color=vec3(1.,1.,1.);\n\
const vec3 source_diffuse_color=vec3(1.,1.,1.);\n\
const vec3 mat_ambient_color=vec3(0.3,0.3,0.3);\n\
const vec3 mat_diffuse_color=vec3(1.,1.,1.);\n\
const float mat_shininess=10.;\n\
\n\
void main(void) {\n\
vec3 mat_ambijent_add=vec3(.0,.0,.0);\n\
vec3 nNorm=vNormal*inv_trans;\n\
for(int i=0;i<24;i+=7)\n\
{\n\
    vec3 raz=vec3(Flights[i+3]+0.001,Flights[i+4],Flights[i+5])-hPos;\n\
      mat_ambijent_add+=max(Flights[i+6]-length(raz),0.)/(Flights[i+6]+0.001)*vec3(Flights[i],Flights[i+1],Flights[i+2])*max(.2, dot(nNorm,normalize(raz)));\n\
}\n\
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
vec3 I_ambient=source_ambient_color*(mat_ambient_color+mat_ambijent_add);\n\
vec3 I_diffuse=source_diffuse_color*mat_diffuse_color*max(0., dot(vNormal, source_direction));\n\
\n\
vec3 I=I_ambient+shadowCoeff*I_diffuse;\n\
gl_FragColor = vec4(I*color4.rgb, color4.a);\n\
}"


  var shader_vertex_water="\n\
attribute vec3 position, normal;\n\
attribute vec2 uv;\n\
uniform mat4 Pmatrix, Vmatrix, Mmatrix, Lmatrix, PmatrixLight;\n\
uniform vec3 cameraPosition;\n\
varying vec3 cPos;\n\
varying vec2 vUV;\n\
varying vec3 vNormal, vLightPos;\n\
varying vec3 hPos;\n\
void main(void) {\n\
\n\
//Shadow mapping : \n\
vec4 lightPos = Lmatrix*Mmatrix*vec4(position, 1.);\n\
lightPos=PmatrixLight*lightPos;\n\
vec3 lightPosDNC=lightPos.xyz/lightPos.w;\n\
vLightPos=vec3(0.5,0.5,0.5)+lightPosDNC*0.5;\n\
vec3 rPos=vec3(Mmatrix*vec4(position, 1.));\n\
cPos=vec3(Mmatrix*vec4(position-cameraPosition, 1.));\n\
hPos=rPos;\n\
gl_Position = Pmatrix*Vmatrix*vec4(rPos, 1.);\n\
vNormal=normal;\n\
vUV=uv;\n\
}";

  var shader_fragment_water="\n\
precision mediump float;\n\
uniform sampler2D sampler;  \n\
uniform sampler2D samplerShadowMap;   \n\
uniform sampler2D sampler2;   \n\
uniform float Flights[30];\n\
uniform float time;\n\
uniform vec3 source_direction;\n\
varying vec2 vUV;\n\
varying vec3 vNormal, vLightPos;\n\
varying vec3 hPos;\n\
varying vec3 cPos;\n\
uniform mat3 inv_trans;\n\
const vec3 source_ambient_color=vec3(1.,1.,1.);\n\
const vec3 source_diffuse_color=vec3(1.,1.,1.);\n\
const vec3 mat_ambient_color=vec3(0.3,0.3,0.3);\n\
const vec3 mat_diffuse_color=vec3(1.,1.,1.);\n\
const float mat_shininess=20.;\n\
\n\
void main(void) {\n\
vec3 mat_ambijent_add=vec3(.0,.0,.0);\n\
vec3 nNorm=vNormal*inv_trans;\n\
for(int i=0;i<24;i+=7)\n\
{\n\
    vec3 raz=vec3(Flights[i+3]+0.001,Flights[i+4],Flights[i+5])-hPos;\n\
      mat_ambijent_add+=max(Flights[i+6]-length(raz),0.)/(Flights[i+6]+0.001)*vec3(Flights[i],Flights[i+1],Flights[i+2]);\n\
}\n\
vec2 uv_shadowMap=vLightPos.xy;\n\
float shadowCoeff=0.0;\n\
float texelSize = 1.0 / 1024.0;\n\
{\n\
  for(int i=-1;i<2;i++)\n\
    for(int j=-1;j<2;j++)\n\
      shadowCoeff+=1.-smoothstep(0.005, 0.006, vLightPos.z-texture2D(samplerShadowMap, uv_shadowMap+vec2(i,j)*texelSize).r);\n\
}\n\
shadowCoeff/=9.0;\n\
vec2 wave_shift = vec2(cos(time*.5+hPos.x*.0525+hPos.z*.02), sin(time*.5+hPos.z*.0525+hPos.x*.02))*0.1;\n\
vec4 color4=texture2D(sampler, hPos.xz*0.05 + vec2(-hPos.z*0.01 + time*.0051+time*.0061) + wave_shift)+\n\
texture2D(sampler,vec2(-hPos.x+time*.12,-hPos.z+hPos.x*0.3+0.5+time*.1)*0.051 - wave_shift*0.8)*vec4(0.6,0.6,0.6,0.1)+\n\
texture2D(sampler2, cPos.xz*0.01 \n\
  + wave_shift*1.5)*\n\
  vec4(0.6,0.6,0.6,0.1);\n\
vec3 I_ambient=source_ambient_color*(mat_ambient_color+mat_ambijent_add);\n\
vec3 I_diffuse=source_diffuse_color*mat_diffuse_color*max(0., dot(vNormal, source_direction));\n\
\n\
vec3 I=I_ambient+shadowCoeff*I_diffuse;\n\
gl_FragColor = vec4(I*color4.rgb, color4.a);\n\
}"

/*
texture2D(sampler,vec2(hPos.x+cos(time*.2+hPos.x*.125+hPos.z*.2),hPos.z+sin(time*.2+hPos.z*.125+hPos.x*.2))*0.05)+\n\
texture2D(sampler,vec2(hPos.x+0.5+cos(-time*.3+hPos.x*.125+hPos.z*.2)*0.5,hPos.z+0.5+sin(-time*.3+hPos.z*.125+hPos.x*.2))*0.07)+\n\
texture2D(sampler2, vec2(rPosition.x+cos(time*.2+rPosition.x*.125+rPosition.z*.2),rPosition.z+sin(time*.2+rPosition.z*.125+rPosition.x*.2))*0.005);\n\
*/