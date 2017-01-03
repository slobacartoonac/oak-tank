//written by Slobodan Zivkovic slobacartoonac@gmail.com
"use strict";
function Shader(gl,vertex,fragment,uniforms,atribs)
{
    this.gl=gl;
    this.vertex=vertex;
    this.fragment=fragment;
    this.uniforms=uniforms;
    this.atribs=atribs;
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertex);
    gl.attachShader(shaderProgram, fragment);
    gl.linkProgram(shaderProgram);
    var link=this;

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            throw "Could not initialise shaders";
        }
    uniforms.forEach(function(e){
        link[e]=gl.getUniformLocation(shaderProgram, e);
    });
    atribs.forEach(function(e){
        link[e]=gl.getAttribLocation(shaderProgram, e);
    });
    gl.useProgram(shaderProgram);
    this.program=shaderProgram;
}
Shader.prototype.select=function()
{
    this.gl.useProgram(this.program);
};